import { Download, Star, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NoteCardCleanProps {
  id: string;
  title: string;
  description?: string | null;
  fileType: string;
  fileSize?: number | null;
  fileUrl: string;
  downloadCount: number;
  ratingSum: number;
  ratingCount: number;
  createdAt: string;
  uploaderName?: string | null;
  isVerified?: boolean;
  tags?: string[] | null;
  onClick?: () => void;
}

const NoteCardClean = ({
  title,
  fileType,
  fileSize,
  fileUrl,
  downloadCount,
  ratingSum,
  ratingCount,
  createdAt,
  uploaderName,
  isVerified,
  tags,
  onClick
}: NoteCardCleanProps) => {

  const getFileTypeLabel = () => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('doc')) return 'DOC';
    if (fileType.includes('ppt') || fileType.includes('presentation')) return 'PPT';
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'XLS';
    return 'FILE';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const rating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : null;
  const label = getFileTypeLabel();

  return (
    <Card 
      className="group relative flex flex-col overflow-hidden border border-border/40 bg-white dark:bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer h-[220px]"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full">
        {/* Top row: file type + verified */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
            <FileText className="h-4 w-4 text-red-500" />
            <span className="text-[11px] font-bold text-red-500">{label}</span>
          </div>
          {isVerified && (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-[10px] px-1.5 py-0.5 gap-0.5">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Title - fixed height, 2 lines max */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem] max-h-[2.5rem] group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>

        {/* Tags - single row */}
        <div className="flex flex-wrap gap-1 mb-2 min-h-[1.375rem] max-h-[1.375rem] overflow-hidden">
          {tags && tags.length > 0 ? (
            <>
              {tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15 truncate max-w-[100px]"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  +{tags.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] invisible">placeholder</span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3 pb-2.5 border-b border-border/40">
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>{downloadCount}</span>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{rating}</span>
            </div>
          )}
          {fileSize && (
            <span>{formatFileSize(fileSize)}</span>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Footer - pushed to bottom */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {uploaderName ? (
            <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
              by <span className="font-medium">{uploaderName}</span>
            </span>
          ) : (
            <span />
          )}
          <Button
            size="sm"
            className="h-7 px-3 text-[11px] btn-premium rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              window.open(fileUrl, '_blank');
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCardClean;
