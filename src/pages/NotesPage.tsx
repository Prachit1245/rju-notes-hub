import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, FileText, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFaculties, usePrograms, useSubjects } from '@/hooks/useSupabaseData';
import { useNotesBySubjects, groupNotesBySubject } from '@/hooks/useNotesHierarchy';
import NoteCardCompact from '@/components/NoteCardCompact';
import VisitorCounter from '@/components/VisitorCounter';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotesPage() {
  const navigate = useNavigate();
  const { faculties } = useFaculties();

  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { programs } = usePrograms(selectedFacultyId || '');
  const { subjects } = useSubjects(selectedProgramId || '', selectedSemester ?? undefined);

  const subjectIds = useMemo(() => subjects.map(s => s.id), [subjects]);
  const { notes, loading: notesLoading } = useNotesBySubjects(subjectIds);

  const selectedProgram = programs.find(p => p.id === selectedProgramId);
  const semesterCount = selectedProgram?.total_semesters ?? 0;
  const semesters = Array.from({ length: semesterCount }, (_, i) => i + 1);

  // Group & filter
  const grouped = useMemo(() => {
    const filtered = searchQuery
      ? notes.filter(n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : notes;
    return groupNotesBySubject(filtered, subjects);
  }, [notes, subjects, searchQuery]);

  const totalNotes = grouped.reduce((sum, g) => sum + g.notes.length, 0);

  const hasSelection = selectedFacultyId && selectedProgramId && selectedSemester;

  // Faculty select handler
  const selectFaculty = (id: string) => {
    setSelectedFacultyId(id);
    setSelectedProgramId(null);
    setSelectedSemester(null);
    setSearchQuery('');
  };

  const selectProgram = (id: string) => {
    setSelectedProgramId(id);
    setSelectedSemester(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Study <span className="gradient-text">Notes</span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">
            Browse notes by faculty, program &amp; semester
          </p>
        </div>

        {/* ── STEP 1: Faculty Tabs ── */}
        <section className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
            <GraduationCap className="h-3.5 w-3.5" /> Select Faculty
          </label>
          <div className="flex flex-wrap gap-2">
            {faculties.map(f => (
              <Button
                key={f.id}
                variant={selectedFacultyId === f.id ? 'default' : 'outline'}
                size="sm"
                className="rounded-full text-xs md:text-sm"
                onClick={() => selectFaculty(f.id)}
              >
                {f.code}
                <span className="hidden md:inline ml-1 opacity-70">– {f.name}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* ── STEP 2: Program Selection ── */}
        {selectedFacultyId && programs.length > 0 && (
          <section className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <FolderOpen className="h-3.5 w-3.5" /> Select Program
            </label>
            <div className="flex flex-wrap gap-2">
              {programs.map(p => (
                <Button
                  key={p.id}
                  variant={selectedProgramId === p.id ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full text-xs md:text-sm"
                  onClick={() => selectProgram(p.id)}
                >
                  {p.code}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 3: Semester Buttons ── */}
        {selectedProgramId && semesters.length > 0 && (
          <section className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <BookOpen className="h-3.5 w-3.5" /> Select Semester
            </label>
            <div className="flex flex-wrap gap-2">
              {semesters.map(sem => (
                <Button
                  key={sem}
                  variant={selectedSemester === sem ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full min-w-[44px] text-xs md:text-sm"
                  onClick={() => { setSelectedSemester(sem); setSearchQuery(''); }}
                >
                  Sem {sem}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* ── Hero Empty State ── */}
        {!hasSelection && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-primary/60" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Select your Faculty &amp; Semester</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              Choose a faculty, program, and semester above to browse study materials organized by subject.
            </p>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Or search all notes by title..."
                className="pl-11 h-12 rounded-xl bg-card border-border/60"
                disabled
              />
            </div>
          </div>
        )}

        {/* ── Results Area ── */}
        {hasSelection && (
          <div>
            {/* Search + count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes in this semester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card border-border/60 focus:border-primary"
                />
              </div>
              {!notesLoading && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {totalNotes} {totalNotes === 1 ? 'note' : 'notes'} found
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {notesLoading && (
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i}>
                    <Skeleton className="h-5 w-48 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {[1, 2, 3, 4].map(j => (
                        <Skeleton key={j} className="h-36 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grouped by subject */}
            {!notesLoading && grouped.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold mb-1">No Notes Yet</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No notes match your search.' : 'No notes have been uploaded for this semester yet.'}
                </p>
              </div>
            )}

            {!notesLoading && grouped.map(({ subject, notes: subjectNotes }) => (
              <section key={subject.id} className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-4 rounded-full bg-primary" />
                  <h2 className="text-base md:text-lg font-semibold">{subject.name}</h2>
                  <span className="text-xs text-muted-foreground ml-1">({subject.code})</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {subjectNotes.length} {subjectNotes.length === 1 ? 'note' : 'notes'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {subjectNotes.map(note => (
                    <NoteCardCompact
                      key={note.id}
                      title={note.title}
                      fileType={note.file_type}
                      fileSize={note.file_size}
                      fileUrl={note.file_url}
                      downloadCount={note.download_count}
                      ratingSum={note.rating_sum}
                      ratingCount={note.rating_count}
                      createdAt={note.created_at}
                      uploaderName={note.uploader_name}
                      isVerified={note.is_verified}
                      onClick={() => navigate(`/notes/${note.id}`)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <VisitorCounter variant="footer" />
    </div>
  );
}
