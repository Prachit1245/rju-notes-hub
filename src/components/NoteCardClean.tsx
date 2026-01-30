import { Download, Star, Calendar, FileText, Image, FileAudio, FileVideo, CheckCircle2 } from 'lucide-react';
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
  description,
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
  
  const getFileIcon = () => {
    const className = 'h-5 w-5';
    if (fileType.startsWith('image/')) return <Image className={className} />;
    if (fileType.startsWith('audio/')) return <FileAudio className={className} />;
    if (fileType.startsWith('video/')) return <FileVideo className={className} />;
    return <FileText className={className} />;
  };

  const getFileTypeConfig = () => {
    if (fileType.includes('pdf')) return { label: 'PDF', bg: 'bg-red-500/15', text: 'text-red-500', border: 'border-red-500/20' };
    if (fileType.includes('doc')) return { label: 'DOC', bg: 'bg-blue-500/15', text: 'text-blue-500', border: 'border-blue-500/20' };
    if (fileType.includes('ppt') || fileType.includes('presentation')) return { label: 'PPT', bg: 'bg-orange-500/15', text: 'text-orange-500', border: 'border-orange-500/20' };
    if (fileType.includes('sheet') || fileType.includes('excel')) return { label: 'XLS', bg: 'bg-green-500/15', text: 'text-green-500', border: 'border-green-500/20' };
    return { label: 'FILE', bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
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

  const fileConfig = getFileTypeConfig();
  const rating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : null;

  return (
    <Card 
      className="group relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm hover:border-electric-purple/50 hover:shadow-lg hover:shadow-electric-purple/5 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* File Type Badge - Top Right */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${fileConfig.bg} border ${fileConfig.border}`}>
            <span className={fileConfig.text}>{getFileIcon()}</span>
            <span className={`text-xs font-semibold ${fileConfig.text}`}>{fileConfig.label}</span>
          </div>
          
          {isVerified && (
            <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 text-[10px] px-1.5 py-0.5 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {description}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 2).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5 text-electric-cyan" />
            <span>{downloadCount}</span>
          </div>
          
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span>{rating}</span>
            </div>
          )}
          
          {fileSize && (
            <span className="text-muted-foreground/70">{formatFileSize(fileSize)}</span>
          )}
          
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Footer: Uploader & Action */}
        <div className="flex items-center justify-between gap-2">
          {uploaderName ? (
            <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
              by <span className="font-medium">{uploaderName}</span>
            </span>
          ) : (
            <span />
          )}
          
          <Button 
            size="sm"
            className="h-8 px-3 text-xs btn-premium rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              window.open(fileUrl, '_blank');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCardClean;
