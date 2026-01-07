import { useEffect, useState } from 'react';
import { Users, Eye, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorStats {
  total_visits: number;
  unique_visitors: number;
}

interface VisitorCounterProps {
  variant?: 'inline' | 'footer';
}

const VisitorCounter = ({ variant = 'inline' }: VisitorCounterProps) => {
  const [stats, setStats] = useState<VisitorStats>({ total_visits: 0, unique_visitors: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const fetchAndIncrement = async () => {
      // Check if user has visited before
      const hasVisited = localStorage.getItem('rju_visited');
      
      if (!hasVisited) {
        // Increment visitor count
        await supabase.rpc('increment_visitor_count');
        localStorage.setItem('rju_visited', 'true');
      }

      // Fetch current stats
      const { data } = await supabase
        .from('visitor_stats')
        .select('total_visits, unique_visitors')
        .limit(1)
        .single();

      if (data) {
        setStats(data);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    };

    fetchAndIncrement();

    // Real-time subscription for live updates
    const channel = supabase
      .channel('visitor-stats-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'visitor_stats'
        },
        (payload) => {
          if (payload.new) {
            setStats({
              total_visits: (payload.new as VisitorStats).total_visits,
              unique_visitors: (payload.new as VisitorStats).unique_visitors
            });
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (variant === 'footer') {
    return (
      <div className="visitor-counter-footer">
        <div className="visitor-footer-inner">
          <div className="visitor-footer-header">
            <Activity className="h-4 w-4 text-electric-green animate-pulse" />
            <span className="visitor-footer-title">Live Stats</span>
            {isLive && (
              <span className="live-indicator">
                <span className="live-dot" />
                LIVE
              </span>
            )}
          </div>
          
          <div className="visitor-footer-stats">
            <div className={`visitor-footer-stat ${isAnimating ? 'animate-scale-up' : ''}`}>
              <div className="visitor-footer-icon visitor-footer-icon-cyan">
                <Eye className="h-5 w-5" />
              </div>
              <div className="visitor-footer-data">
                <span className="visitor-footer-number">{stats.total_visits.toLocaleString()}</span>
                <span className="visitor-footer-label">Total Visits</span>
              </div>
            </div>
            
            <div className="visitor-footer-divider" />
            
            <div className={`visitor-footer-stat ${isAnimating ? 'animate-scale-up' : ''}`}>
              <div className="visitor-footer-icon visitor-footer-icon-purple">
                <Users className="h-5 w-5" />
              </div>
              <div className="visitor-footer-data">
                <span className="visitor-footer-number">{stats.unique_visitors.toLocaleString()}</span>
                <span className="visitor-footer-label">Unique Visitors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="visitor-counter-container">
      <div className={`visitor-counter ${isAnimating ? 'animate-pulse-glow' : ''}`}>
        <div className="visitor-icon">
          <Eye className="h-5 w-5 text-electric-cyan" />
        </div>
        <div className="visitor-stats">
          <div className="visitor-count">
            <TrendingUp className="h-3 w-3 text-electric-green" />
            <span className="count-number">{stats.total_visits.toLocaleString()}</span>
          </div>
          <span className="visitor-label">Total Visits</span>
        </div>
        <div className="visitor-divider" />
        <div className="visitor-stats">
          <div className="visitor-count">
            <Users className="h-3 w-3 text-electric-purple" />
            <span className="count-number">{stats.unique_visitors.toLocaleString()}</span>
          </div>
          <span className="visitor-label">Unique Visitors</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
