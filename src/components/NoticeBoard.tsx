import { useState, useEffect } from 'react';
import { Bell, Calendar, ExternalLink, RefreshCw } from 'lucide-react';
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

  const fetchNotices = async () => {
    try {
      // Calculate date 10 days ago
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .gte('published_at', tenDaysAgo.toISOString())
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
  };

  const refreshNotices = async () => {
    setRefreshing(true);
    try {
      // Call the edge function to fetch new notices from RJU
      const { data, error } = await supabase.functions.invoke('fetch-rju-notices');
      
      if (error) throw error;
      
      // Refresh the local notices after fetching new ones
      await fetchNotices();
      
      toast({
        title: "Success",
        description: `Notices updated! ${data.newNotices} new notices added.`,
      });
    } catch (error) {
      console.error('Error refreshing notices:', error);
      toast({
        title: "Error", 
        description: "Failed to refresh notices from RJU website",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();

    // Set up real-time subscription for notice updates
    const channel = supabase
      .channel('notices-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notices'
        },
        (payload) => {
          console.log('New notice received:', payload);
          setNotices(prev => [payload.new as Notice, ...prev.slice(0, 9)]);
          
          toast({
            title: "New Notice!",
            description: (payload.new as Notice).title,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'examinations':
        return 'bg-red-100 text-red-800';
      case 'vacancy':
        return 'bg-green-100 text-green-800';
      case 'admissions':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <Card>
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
    <Card>
      <CardHeader className="p-3 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Latest RJU Notices
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshNotices}
              disabled={refreshing}
              className="bg-primary/5 hover:bg-primary/10 text-xs md:text-sm h-8 px-2 md:px-3"
            >
              <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
        {notices.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <Bell className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              No notices available. Click refresh to fetch latest notices.
            </p>
            <Button onClick={refreshNotices} disabled={refreshing} className="bg-primary hover:bg-primary/90 text-xs md:text-sm h-9">
              <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Fetch Notices
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border rounded-lg p-2.5 md:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-1.5 md:mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xs md:text-lg line-clamp-2 mb-1.5 md:mb-2">
                      {notice.title}
                    </h3>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 flex-wrap">
                      <Badge className={`${getCategoryColor(notice.category)} text-[10px] md:text-xs px-1.5 md:px-2`}>
                        {notice.category}
                      </Badge>
                      {notice.priority !== 'normal' && (
                        <Badge className={`${getPriorityColor(notice.priority)} text-[10px] md:text-xs px-1.5 md:px-2`}>
                          {notice.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-[11px] md:text-sm line-clamp-2 md:line-clamp-3 mb-2 md:mb-3">
                  {notice.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] md:text-sm text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    {formatDate(notice.published_at)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://rju.edu.np/notices/', '_blank')}
                    className="text-primary hover:bg-primary/10 text-[10px] md:text-xs h-7 md:h-8 px-2"
                  >
                    <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full bg-primary/5 hover:bg-primary/10 text-primary text-xs md:text-sm h-9 md:h-10"
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