import { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const shareUrl = url || window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with your friends",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out "${title}" on RJU Notes: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out "${title}" on RJU Notes`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  // Use native share on mobile if available
  if (navigator.share) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
        className={className}
      >
        <Share2 className="h-3.5 w-3.5 mr-1.5" />
        Share
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyToClipboard}>
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4 mr-2" />
          )}
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWhatsApp}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
