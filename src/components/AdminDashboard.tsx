import { useState, useEffect } from 'react';
import { Trash2, Eye, EyeOff, Download, FileText, Image, FileAudio, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  uploader_name: string | null;
  uploader_email: string | null;
  is_public: boolean;
  created_at: string;
  download_count: number;
  subjects?: {
    name: string;
    code: string;
    semester: number;
    programs?: {
      name: string;
      code: string;
    };
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          subjects (
            name,
            code,
            semester,
            programs (
              name,
              code
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const deleteNote = async (noteId: string, fileName: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('notes')
        .remove([`notes/${fileName}`]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (dbError) throw dbError;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const togglePublic = async (noteId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_public: !currentStatus })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, is_public: !currentStatus }
          : note
      ));

      toast({
        title: "Success",
        description: `Note ${!currentStatus ? 'made public' : 'made private'}`,
      });
    } catch (error) {
      console.error('Error updating note visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update note visibility",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <FileAudio className="h-4 w-4" />;
    if (type.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Notes</h2>
          <p className="text-muted-foreground">
            View, edit, and manage all uploaded notes
          </p>
        </div>
        <Badge variant="secondary">
          {notes.length} total notes
        </Badge>
      </div>

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No notes uploaded yet</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getFileIcon(note.file_type)}
                      {note.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {note.subjects ? (
                        <>
                          {note.subjects.programs?.name} ({note.subjects.programs?.code}) - 
                          Semester {note.subjects.semester} - {note.subjects.name}
                        </>
                      ) : (
                        'Subject information not available'
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={note.is_public ? "default" : "secondary"}>
                      {note.is_public ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {note.description && (
                    <p className="text-sm text-muted-foreground">
                      {note.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">File Size:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {formatFileSize(note.file_size)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Downloads:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {note.download_count}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Uploader:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {note.uploader_name || 'Anonymous'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Upload Date:</span>
                      <br />
                      <span className="text-muted-foreground">
                        {formatDate(note.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(note.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublic(note.id, note.is_public)}
                    >
                      {note.is_public ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Make Public
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNote(note.id, note.file_name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}