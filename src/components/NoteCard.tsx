import { Link } from 'react-router-dom';
import { Download, Eye, Star, Calendar, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NoteCardProps {
  title: string;
  subject: string;
  semester: string;
  faculty: string;
  fileType: 'pdf' | 'doc' | 'ppt' | string;
  uploadDate: string;
  downloads: number;
  rating: number;
  contributor?: string;
  size?: string;
  noteId?: string;
}

const NoteCard = ({ 
  title, 
  subject, 
  semester, 
  faculty, 
  fileType, 
  uploadDate, 
  downloads, 
  rating, 
  contributor,
  size,
  noteId
}: NoteCardProps) => {
  const getFileTypeConfig = (type: string) => {
    if (type.includes('pdf') || type === 'pdf') return { label: 'PDF', gradient: 'from-red-500 to-rose-600' };
    if (type.includes('doc') || type === 'doc') return { label: 'DOC', gradient: 'from-blue-500 to-indigo-600' };
    if (type.includes('ppt') || type === 'ppt') return { label: 'PPT', gradient: 'from-orange-500 to-amber-600' };
    return { label: 'FILE', gradient: 'from-gray-500 to-gray-600' };
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const fileConfig = getFileTypeConfig(fileType);

  const cardContent = (
    <Card className="note-card-premium group cursor-pointer h-full">
      <CardContent className="p-4 md:p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-electric-purple transition-colors">
                {title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">{subject}</p>
            </div>
            <div className={`file-badge bg-gradient-to-br ${fileConfig.gradient}`}>
              <span className="text-[10px] font-bold text-white">{fileConfig.label}</span>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <Download className="h-3.5 w-3.5 text-electric-cyan" />
              <span>{downloads.toLocaleString()}</span>
            </div>
            {rating > 0 && (
              <div className="stat-item">
                <Star className="h-3.5 w-3.5 fill-electric-orange text-electric-orange" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            <div className="stat-item ml-auto text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(uploadDate)}</span>
            </div>
          </div>

          {(size || contributor) && (
            <div className="flex items-center justify-between text-[10px] md:text-xs pt-2 border-t border-border/30">
              {size && <span className="text-muted-foreground">{size}</span>}
              {contributor && <span className="text-muted-foreground">By {contributor}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (noteId) {
    return <Link to={`/notes/${noteId}`} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
};

export default NoteCard;
