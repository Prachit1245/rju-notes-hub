import { Download, Star, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NoteCardCompactProps {
  title: string;
  fileType: string;
  fileSize?: number | null;
  fileUrl: string;
  downloadCount: number;
  ratingSum: number;
  ratingCount: number;
  createdAt: string;
  uploaderName?: string | null;
  isVerified?: boolean;
  onClick?: () => void;
}

const NoteCardCompact = ({
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
  onClick,
}: NoteCardCompactProps) => {
  const getFileLabel = () => {
    if (fileType.includes('pdf')) return { label: 'PDF', color: 'bg-red-500' };
    if (fileType.includes('doc')) return { label: 'DOC', color: 'bg-blue-500' };
    if (fileType.includes('ppt') || fileType.includes('presentation')) return { label: 'PPT', color: 'bg-orange-500' };
    if (fileType.includes('sheet') || fileType.includes('excel')) return { label: 'XLS', color: 'bg-green-500' };
    return { label: 'FILE', color: 'bg-muted-foreground' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const file = getFileLabel();
  const rating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : null;

  return (
    <div
      className="group flex flex-col h-full bg-card border border-border/60 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Top color strip */}
      <div className={`h-1 w-full ${file.color}`} />

      <div className="flex flex-col flex-1 p-4">
        {/* Header: file badge + verified */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white ${file.color}`}>
            {file.label}
          </span>
          {isVerified && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 gap-0.5 border-green-500/30 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Title - single line truncated */}
        <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-primary transition-colors mb-auto">
          {title}
        </h3>

        {/* Footer metadata */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {fileSize && <span>{formatFileSize(fileSize)}</span>}
            <span className="flex items-center gap-0.5">
              <Calendar className="h-3 w-3" />
              {formatDate(createdAt)}
            </span>
            {rating && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {rating}
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              window.open(fileUrl, '_blank');
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Uploader */}
        {uploaderName && (
          <p className="text-[10px] text-muted-foreground/60 mt-1 truncate">
            by {uploaderName}
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteCardCompact;
