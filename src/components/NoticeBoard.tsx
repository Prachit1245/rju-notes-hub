import { useState, useEffect, useCallback } from 'react';
import { Bell, RefreshCw, Radio, ImageOff, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  published_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  image_url?: string | null;
  source_url?: string | null;
}

const FALLBACK_URL = 'https://rju.edu.np/notices/';

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchNotices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotices((data || []) as Notice[]);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotices = useCallback(async (showToast = true) => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rju-notices');
      if (error) throw error;
      await fetchNotices();
      if (showToast) {
        toast({
          title: 'Notices updated',
          description: `${data?.newNotices ?? 0} new notice${data?.newNotices === 1 ? '' : 's'} synced.`,
        });
      }
    } catch (error) {
      console.error('Error refreshing notices:', error);
      if (showToast) {
        toast({ title: 'Error', description: 'Failed to refresh notices', variant: 'destructive' });
      }
    } finally {
      setRefreshing(false);
    }
  }, [fetchNotices, toast]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await fetchNotices();
      if (isMounted) await refreshNotices(false);
    })();

    const interval = window.setInterval(() => refreshNotices(false), 1000 * 60 * 30);

    const channel = supabase
      .channel('notices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, async (payload) => {
        await fetchNotices();
        if (payload.eventType === 'INSERT') {
          toast({ title: 'New Notice', description: (payload.new as Notice).title });
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchNotices, refreshNotices, toast]);

  const openNotice = (n: Notice) => {
    window.open(n.source_url || FALLBACK_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="notice-board-shell overflow-hidden border-border/60 bg-card/90 shadow-lg backdrop-blur-xl">
      <CardHeader className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Bell className="h-4 w-4 text-primary" />
              Latest RJU Notices
            </CardTitle>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground mt-1">
              <Radio className={`h-3 w-3 ${refreshing ? 'animate-pulse' : ''} text-primary`} />
              <span>Auto-syncs daily · 8:00 PM NPT</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshNotices(true)}
            disabled={refreshing}
            className="h-8 px-2 text-xs"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="text-xs text-muted-foreground mb-3">No notices yet.</p>
            <Button onClick={() => refreshNotices(true)} disabled={refreshing} size="sm">
              <RefreshCw className={`h-3 w-3 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
              Fetch Now
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-2.5">
              {notices.map((n, idx) => (
                <button
                  key={n.id}
                  onClick={() => openNotice(n)}
                  className="notice-tile group relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted/40 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ animation: `fade-in 0.4s ease-out both`, animationDelay: `${idx * 50}ms` }}
                  title={n.title}
                >
                  {n.image_url ? (
                    <img
                      src={n.image_url}
                      alt={n.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <ImageOff className="h-6 w-6 text-primary/40" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Title */}
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <p className="text-white text-[10px] md:text-[11px] font-semibold leading-tight line-clamp-3 drop-shadow">
                      {n.title}
                    </p>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 text-xs h-8"
              onClick={() => window.open(FALLBACK_URL, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1.5" />
              View All on rju.edu.np
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
