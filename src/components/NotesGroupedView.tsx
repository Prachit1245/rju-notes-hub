import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NoteCardClean from '@/components/NoteCardClean';
import type { Note, Subject } from '@/hooks/useSupabaseData';

interface NotesGroupedViewProps {
  notes: Note[];
  subjects: Subject[];
  loading: boolean;
  searchQuery?: string;
}

const NotesGroupedView = ({ notes, subjects, loading, searchQuery = '' }: NotesGroupedViewProps) => {
  const navigate = useNavigate();

  // Filter notes by search query
  const filteredNotes = notes.filter(note =>
    searchQuery === '' || 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group notes by subject
  const notesBySubject = subjects.reduce((acc, subject) => {
    const subjectNotes = filteredNotes.filter(note => note.subject_id === subject.id);
    if (subjectNotes.length > 0) {
      acc[subject.id] = {
        subject,
        notes: subjectNotes
      };
    }
    return acc;
  }, {} as Record<string, { subject: Subject; notes: Note[] }>);

  // Group subjects by semester for organized display
  const subjectsBySemester = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {} as Record<number, Subject[]>);

  const semesters = Object.keys(subjectsBySemester).map(Number).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <Card className="notes-empty-card">
        <CardContent className="text-center py-12 md:py-20">
          <div className="empty-icon-wrapper">
            <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 mt-4">No Notes Found</h3>
          <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery 
              ? "No notes match your search. Try different keywords."
              : "No notes available for the selected filters yet."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
        </p>
      </div>

      {/* Grouped by Semester */}
      {semesters.map(semester => {
        const semesterSubjects = subjectsBySemester[semester];
        const semesterHasNotes = semesterSubjects.some(s => notesBySubject[s.id]);
        
        if (!semesterHasNotes) return null;

        return (
          <div key={semester} className="space-y-4">
            {/* Semester Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold">
                Semester {semester}
              </h2>
              <Badge variant="secondary" className="ml-auto text-xs">
                {semesterSubjects.filter(s => notesBySubject[s.id]).length} subjects
              </Badge>
            </div>

            {/* Subjects within this semester */}
            <div className="space-y-4 pl-2 md:pl-4 border-l-2 border-border/50">
              {semesterSubjects.map(subject => {
                const subjectData = notesBySubject[subject.id];
                if (!subjectData) return null;

                return (
                  <div key={subject.id} className="space-y-3">
                    {/* Subject Header */}
                    <div className="flex items-center gap-2 pl-3 py-2 bg-muted/30 rounded-lg">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">
                          {subject.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {subject.code} • {subjectData.notes.length} {subjectData.notes.length === 1 ? 'note' : 'notes'}
                        </p>
                      </div>
                    </div>

                    {/* Notes Grid for this subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-3">
                      {subjectData.notes.map(note => (
                        <NoteCardClean
                          key={note.id}
                          id={note.id}
                          title={note.title}
                          description={note.description}
                          fileType={note.file_type}
                          fileSize={note.file_size}
                          fileUrl={note.file_url}
                          downloadCount={note.download_count}
                          ratingSum={note.rating_sum}
                          ratingCount={note.rating_count}
                          createdAt={note.created_at}
                          uploaderName={note.uploader_name}
                          isVerified={note.is_verified}
                          tags={note.tags}
                          onClick={() => navigate(`/notes/${note.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotesGroupedView;
