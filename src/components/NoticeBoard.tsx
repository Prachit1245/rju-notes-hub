import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bell, Calendar, ExternalLink, RefreshCw, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
}

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
      
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshNotices = useCallback(async (showToast = true) => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-rju-notices');
      
      if (error) throw error;
      
      await fetchNotices();
      
      if (showToast) {
        toast({
          title: 'Notices updated',
          description: `${data?.newNotices ?? 0} new notice${data?.newNotices === 1 ? '' : 's'} synced from RJU.`,
        });
      }
    } catch (error) {
      console.error('Error refreshing notices:', error);
      if (showToast) {
        toast({
          title: 'Error', 
          description: 'Failed to refresh notices from RJU website',
          variant: 'destructive',
        });
      }
    } finally {
      setRefreshing(false);
    }
  }, [fetchNotices, toast]);

  useEffect(() => {
    let isMounted = true;

    const loadAndSyncNotices = async () => {
      await fetchNotices();
      if (isMounted) {
        await refreshNotices(false);
      }
    };

    loadAndSyncNotices();

    const interval = window.setInterval(() => {
      refreshNotices(false);
    }, 1000 * 60 * 15);

    const channel = supabase
      .channel('notices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notices'
        },
        async (payload) => {
          console.log('Notice change received:', payload);
          await fetchNotices();

          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Notice!',
              description: (payload.new as Notice).title,
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchNotices, refreshNotices, toast]);

  const tickerItems = useMemo(() => {
    if (notices.length === 0) return [];
    return [...notices, ...notices];
  }, [notices]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exam':
      case 'examinations':
        return 'notice-pill notice-pill-danger';
      case 'vacancy':
        return 'notice-pill notice-pill-success';
      case 'result':
        return 'notice-pill notice-pill-warning';
      case 'admissions':
      case 'admission':
        return 'notice-pill notice-pill-info';
      default:
        return 'notice-pill';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'notice-priority notice-priority-high';
      case 'medium':
        return 'notice-priority notice-priority-medium';
      default:
        return 'notice-priority';
    }
  };

  if (loading) {
    return (
      <Card className="notice-board-shell overflow-hidden border-border/60 bg-card/90 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notice Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading notices...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="notice-board-shell overflow-hidden border-border/60 bg-card/90 shadow-xl backdrop-blur-xl">
      <CardHeader className="p-3 md:p-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                <Bell className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Latest RJU Notices
              </CardTitle>
              <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground">
                <Radio className={`h-3.5 w-3.5 ${refreshing ? 'animate-pulse text-primary' : 'text-primary'}`} />
                <span>Auto-syncing recent 10 notices from RJU</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refreshNotices(true)}
              disabled={refreshing}
              className="bg-primary/5 hover:bg-primary/10 text-xs md:text-sm h-8 px-2 md:px-3"
            >
              <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>

          {tickerItems.length > 0 && (
            <div className="notice-ticker-shell">
              <div className="notice-ticker-track">
                {tickerItems.map((notice, index) => (
                  <div key={`${notice.id}-${index}`} className="notice-ticker-item">
                    <span className="notice-ticker-dot" aria-hidden="true" />
                    <span className="truncate">{notice.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
        {notices.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <Bell className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              No notices available yet. Start a sync to fetch the latest notices.
            </p>
            <Button onClick={() => refreshNotices(true)} disabled={refreshing} className="bg-primary hover:bg-primary/90 text-xs md:text-sm h-9">
              <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Fetch Notices
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground">
                <span className="notice-live-dot" aria-hidden="true" />
                <span className="font-medium tracking-wide uppercase">Live · Top {notices.length}</span>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground/80">Scroll for more ↓</span>
            </div>
            <div className="notice-list-scroll space-y-2.5 md:space-y-3">
              {notices.map((notice, idx) => (
                <div
                  key={notice.id}
                  className="notice-item-anim notice-card-hover border rounded-lg p-2.5 md:p-3.5 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs md:text-sm line-clamp-2 mb-1.5">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <Badge className={`${getCategoryColor(notice.category)} text-[10px] px-1.5`}>
                          {notice.category}
                        </Badge>
                        {notice.priority !== 'normal' && (
                          <Badge className={`${getPriorityColor(notice.priority)} text-[10px] px-1.5`}>
                            {notice.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-[11px] md:text-xs line-clamp-2 mb-2">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      {formatDate(notice.published_at)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://rju.edu.np/notices/', '_blank')}
                      className="text-primary hover:bg-primary/10 text-[10px] md:text-xs h-7 px-2 hover-scale"
                    >
                      <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full bg-primary/5 hover:bg-primary/10 text-primary text-xs md:text-sm h-9 md:h-10 hover-scale"
              onClick={() => window.open('https://rju.edu.np/notices/', '_blank')}
            >
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              View All Notices
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}