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
      <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Latest RJU Notices
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshNotices}
              disabled={refreshing}
              className="bg-primary/5 hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
      </CardHeader>
      <CardContent>
        {notices.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No notices available. Click refresh to fetch latest notices from RJU website.
            </p>
            <Button onClick={refreshNotices} disabled={refreshing} className="bg-primary hover:bg-primary/90">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Fetch Notices
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {notice.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(notice.category)}>
                        {notice.category}
                      </Badge>
                      {notice.priority !== 'normal' && (
                        <Badge className={getPriorityColor(notice.priority)}>
                          {notice.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                  {notice.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(notice.published_at)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://rju.edu.np/notices/', '_blank')}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full bg-primary/5 hover:bg-primary/10 text-primary"
              onClick={() => window.open('https://rju.edu.np/notices/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Notices on RJU Website
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}