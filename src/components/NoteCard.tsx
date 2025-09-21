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
    <Card className="card-gradient group cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-5 line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{subject}</p>
            </div>
            <div className={`file-icon ${fileType} ml-2`}>
              {getFileTypeDisplay(fileType)}
            </div>
          </div>

          {/* Academic Info */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {faculty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sem {semester}
            </Badge>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Download className="h-3 w-3" />
                <span>{downloads}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{uploadDate}</span>
              </div>
            </div>
            <span className="text-xs">{size}</span>
          </div>

          {/* Contributor */}
          {contributor && (
            <p className="text-xs text-muted-foreground">
              By {contributor}
            </p>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button size="sm" className="flex-1">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;