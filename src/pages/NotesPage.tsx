import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Download, Star, Calendar, FileText, Image, FileAudio, FileVideo, GraduationCap, BookMarked, BookOpen, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFaculties, usePrograms, useSubjects, useNotes } from '@/hooks/useSupabaseData';
import VisitorCounter from '@/components/VisitorCounter';

export default function NotesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { faculties } = useFaculties();
  
  // Initialize from URL params
  const [selectedFaculty, setSelectedFaculty] = useState<string>(searchParams.get('faculty') || 'all');
  const [selectedProgram, setSelectedProgram] = useState<string>(searchParams.get('program') || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>(searchParams.get('semester') || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const { programs } = usePrograms(selectedFaculty === 'all' ? '' : selectedFaculty);
  const { subjects } = useSubjects(
    selectedProgram === 'all' ? '' : selectedProgram, 
    selectedSemester === 'all' ? undefined : parseInt(selectedSemester)
  );
  const { notes, loading } = useNotes(selectedSubject === 'all' ? '' : selectedSubject);

  // Sync URL params to state on mount
  useEffect(() => {
    const faculty = searchParams.get('faculty');
    const program = searchParams.get('program');
    const semester = searchParams.get('semester');
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');

    if (faculty) setSelectedFaculty(faculty);
    if (program) setSelectedProgram(program);
    if (semester) setSelectedSemester(semester);
    if (subject) setSelectedSubject(subject);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const getFileIcon = (type: string, size: 'sm' | 'md' = 'sm') => {
    const className = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    if (type.startsWith('image/')) return <Image className={className} />;
    if (type.startsWith('audio/')) return <FileAudio className={className} />;
    if (type.startsWith('video/')) return <FileVideo className={className} />;
    return <FileText className={className} />;
  };

  const getFileTypeBadge = (type: string) => {
    if (type.includes('pdf')) return { label: 'PDF', class: 'bg-red-500/20 text-red-500' };
    if (type.includes('doc')) return { label: 'DOC', class: 'bg-blue-500/20 text-blue-500' };
    if (type.includes('ppt') || type.includes('presentation')) return { label: 'PPT', class: 'bg-orange-500/20 text-orange-500' };
    if (type.includes('sheet') || type.includes('excel')) return { label: 'XLS', class: 'bg-green-500/20 text-green-500' };
    return { label: 'FILE', class: 'bg-gray-500/20 text-gray-500' };
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
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredNotes = notes.filter(note =>
    searchQuery === '' || 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedProgramData = programs.find(p => p.id === selectedProgram);
  const semesterOptions = selectedProgramData 
    ? Array.from({ length: selectedProgramData.total_semesters }, (_, i) => i + 1)
    : [];

  const clearFilters = () => {
    setSelectedFaculty('all');
    setSelectedProgram('all');
    setSelectedSemester('all');
    setSelectedSubject('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedFaculty !== 'all' || selectedProgram !== 'all' || 
                           selectedSemester !== 'all' || selectedSubject !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 opacity-30" />
        <div className="orb orb-2 opacity-30" />
      </div>

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8">
          {/* Header */}
          <div className="mb-4 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="section-icon-wrapper">
                <BookOpen className="h-5 w-5 text-electric-purple" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">
                  Study <span className="hero-title-gradient">Notes</span>
                </h1>
              </div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground ml-0 md:ml-14">
              Access study materials by faculty, program & semester
            </p>
          </div>

          {/* Search Bar - Always Visible */}
          <div className="mb-4 md:mb-6">
            <div className="search-box-premium">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 md:h-12 text-sm md:text-base bg-background/80 border-border/50 focus:border-electric-purple rounded-xl"
                  />
                </div>
                <Button 
                  variant="outline"
                  className="h-11 md:h-12 px-3 md:px-4 rounded-xl md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className={`mb-4 md:mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="notes-filter-card">
              <CardContent className="p-3 md:p-5">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-electric-purple" />
                    <span className="font-semibold text-sm md:text-base">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs md:text-sm h-7 md:h-8"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {/* Faculty */}
                  <div className="space-y-1.5">
                    <label className="filter-label-small">
                      <GraduationCap className="h-3 w-3" />
                      Faculty
                    </label>
                    <Select value={selectedFaculty} onValueChange={(value) => {
                      setSelectedFaculty(value);
                      setSelectedProgram('all');
                      setSelectedSemester('all');
                      setSelectedSubject('all');
                    }}>
                      <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm rounded-lg">
                        <SelectValue placeholder="All Faculties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Faculties</SelectItem>
                        {faculties.map(faculty => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.code} - {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Program */}
                  <div className="space-y-1.5">
                    <label className="filter-label-small">
                      <BookMarked className="h-3 w-3" />
                      Program
                    </label>
                    <Select 
                      value={selectedProgram} 
                      onValueChange={(value) => {
                        setSelectedProgram(value);
                        setSelectedSemester('all');
                        setSelectedSubject('all');
                      }}
                      disabled={selectedFaculty === 'all'}
                    >
                      <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm rounded-lg">
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {programs.map(program => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Semester */}
                  <div className="space-y-1.5">
                    <label className="filter-label-small">
                      <BookOpen className="h-3 w-3" />
                      Semester
                    </label>
                    <Select 
                      value={selectedSemester} 
                      onValueChange={(value) => {
                        setSelectedSemester(value);
                        setSelectedSubject('all');
                      }}
                      disabled={selectedProgram === 'all'}
                    >
                      <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm rounded-lg">
                        <SelectValue placeholder="All Sem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {semesterOptions.map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="filter-label-small">
                      <FileText className="h-3 w-3" />
                      Subject
                    </label>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={setSelectedSubject}
                      disabled={selectedSemester === 'all'}
                    >
                      <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm rounded-lg">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
              </p>
            </div>
          )}

          {/* Notes Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="loading-spinner"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <Card className="notes-empty-card">
              <CardContent className="text-center py-12 md:py-20">
                <div className="empty-icon-wrapper">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 mt-4">No Notes Found</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                  {selectedSubject !== 'all'
                    ? "No notes available for the selected subject yet."
                    : searchQuery 
                      ? "No notes match your search. Try different keywords."
                      : "Select a faculty, program, and semester to browse notes."
                  }
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => {
                const fileType = getFileTypeBadge(note.file_type);
                return (
                  <Card 
                    key={note.id} 
                    className="note-card-premium cursor-pointer"
                    onClick={() => navigate(`/notes/${note.id}`)}
                  >
                    <CardContent className="p-3 md:p-4">
                      {/* Header */}
                      <div className="flex items-start gap-2 md:gap-3 mb-3">
                        <div className={`file-badge ${fileType.class}`}>
                          {getFileIcon(note.file_type, 'md')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-electric-purple transition-colors">
                            {note.title}
                          </h3>
                          {note.description && (
                            <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {note.description}
                            </p>
                          )}
                        </div>
                        {note.is_verified && (
                          <Badge variant="secondary" className="text-[9px] md:text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-600 border-green-500/30">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className={`tag-badge ${fileType.class.replace('/20', '/15')}`}>
                          {fileType.label}
                        </span>
                        {note.file_size && (
                          <span className="tag-badge tag-cyan">
                            {formatFileSize(note.file_size)}
                          </span>
                        )}
                        {note.tags?.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="tag-badge tag-purple">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="stats-row">
                        <div className="stat-item">
                          <Download className="h-3 w-3 text-electric-cyan" />
                          <span>{note.download_count}</span>
                        </div>
                        {note.rating_count > 0 && (
                          <div className="stat-item">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span>{(note.rating_sum / note.rating_count).toFixed(1)}</span>
                          </div>
                        )}
                        <div className="stat-item ml-auto">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatDate(note.created_at)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button 
                          className="flex-1 h-8 md:h-9 text-xs md:text-sm btn-premium" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(note.file_url, '_blank');
                          }}
                        >
                          <Download className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                          Download
                        </Button>
                        {note.file_type === 'application/pdf' && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 md:h-9 text-xs md:text-sm rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(note.file_url, '_blank');
                            }}
                          >
                            Preview
                          </Button>
                        )}
                      </div>

                      {/* Uploader */}
                      {note.uploader_name && (
                        <div className="text-[10px] md:text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
                          Uploaded by <span className="font-medium">{note.uploader_name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Visitor Counter */}
        <VisitorCounter variant="footer" />
      </div>
    </div>
  );
}
