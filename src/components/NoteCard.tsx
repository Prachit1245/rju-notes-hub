import { Download, Eye, Star, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NoteCardProps {
  title: string;
  subject: string;
  semester: string;
  faculty: string;
  fileType: 'pdf' | 'doc' | 'ppt';
  uploadDate: string;
  downloads: number;
  rating: number;
  contributor?: string;
  size: string;
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
  size 
}: NoteCardProps) => {
  const getFileTypeConfig = (type: string) => {
    switch (type) {
      case 'pdf': return { label: 'PDF', gradient: 'from-red-500 to-rose-600' };
      case 'doc': return { label: 'DOC', gradient: 'from-blue-500 to-indigo-600' };
      case 'ppt': return { label: 'PPT', gradient: 'from-orange-500 to-amber-600' };
      default: return { label: 'FILE', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const fileConfig = getFileTypeConfig(fileType);

  return (
    <Card className="note-card-premium group cursor-pointer">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-electric-purple transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 font-medium">{subject}</p>
            </div>
            <div className={`file-badge bg-gradient-to-br ${fileConfig.gradient}`}>
              <span className="text-[10px] font-bold text-white">{fileConfig.label}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="tag-badge tag-purple">
              <Sparkles className="h-3 w-3" />
              {faculty}
            </span>
            <span className="tag-badge tag-cyan">
              Sem {semester}
            </span>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-item">
              <Download className="h-4 w-4 text-electric-cyan" />
              <span>{downloads.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <Star className="h-4 w-4 fill-electric-orange text-electric-orange" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="stat-item text-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>{uploadDate}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="tag-badge tag-orange text-[10px]">{size}</span>
            {contributor && (
              <span className="text-muted-foreground">By <span className="font-medium">{contributor}</span></span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 rounded-xl border-border/50 hover:border-electric-purple hover:bg-electric-purple/10">
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
            </Button>
            <Button size="sm" className="flex-1 rounded-xl btn-premium text-sm">
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
