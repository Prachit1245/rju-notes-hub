import { Download, Eye, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const getFileTypeDisplay = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'doc': return 'DOC';
      case 'ppt': return 'PPT';
      default: return 'FILE';
    }
  };

  return (
    <Card className="card-gradient group cursor-pointer hover:scale-105 transition-all duration-500 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base leading-6 line-clamp-2 group-hover:text-rju-purple transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{subject}</p>
            </div>
            <div className={`file-icon ${fileType} ml-3 flex-shrink-0`}>
              {getFileTypeDisplay(fileType)}
            </div>
          </div>

          {/* Academic Info */}
          <div className="flex flex-wrap gap-2">
            <span className="badge-purple">
              {faculty}
            </span>
            <span className="badge-cyan">
              Semester {semester}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-rju-gray-light/50 rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4 text-rju-cyan" />
                <span className="font-medium">{downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-rju-orange text-rju-orange" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span>{uploadDate}</span>
            </div>
          </div>

          {/* Size & Contributor */}
          <div className="flex items-center justify-between text-xs">
            <span className="badge-orange">{size}</span>
            {contributor && (
              <span className="text-muted-foreground">By {contributor}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button variant="outline" size="sm" className="flex-1 nav-link">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="flex-1 btn-glow">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;