import { useEffect, useState } from 'react';
import { Users, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorStats {
  total_visits: number;
  unique_visitors: number;
}

const VisitorCounter = () => {
  const [stats, setStats] = useState<VisitorStats>({ total_visits: 0, unique_visitors: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

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
  }, []);

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
