import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Star, Calendar, FileText, Image, FileAudio, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFaculties, usePrograms, useSubjects, useNotes } from '@/hooks/useSupabaseData';

export default function NotesPage() {
  const navigate = useNavigate();
  const { faculties } = useFaculties();
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { programs } = usePrograms(selectedFaculty === 'all' ? '' : selectedFaculty);
  const { subjects } = useSubjects(
    selectedProgram === 'all' ? '' : selectedProgram, 
    selectedSemester === 'all' ? undefined : parseInt(selectedSemester)
  );
  const { notes, loading } = useNotes(selectedSubject === 'all' ? '' : selectedSubject);

  const getFileIcon = (type: string, size: 'sm' | 'md' = 'sm') => {
    const className = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    if (type.startsWith('image/')) return <Image className={className} />;
    if (type.startsWith('audio/')) return <FileAudio className={className} />;
    if (type.startsWith('video/')) return <FileVideo className={className} />;
    return <FileText className={className} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-lg md:text-3xl font-bold text-foreground mb-1 md:mb-2">Study Notes</h1>
          <p className="text-xs md:text-base text-muted-foreground">
            Access study materials by faculty, program & semester
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-3 md:mb-6">
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="flex items-center gap-1.5 md:gap-2 text-sm md:text-lg">
              <Filter className="h-3.5 md:h-5 w-3.5 md:w-5" />
              Filter Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 md:space-y-4 p-3 pt-0 md:p-6 md:pt-0">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto h-9 md:h-10 text-xs md:text-sm">
                <Search className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                Search
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <Select value={selectedFaculty} onValueChange={(value) => {
                setSelectedFaculty(value);
                setSelectedProgram('all');
                setSelectedSemester('all');
                setSelectedSubject('all');
              }}>
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedProgram} 
                onValueChange={(value) => {
                  setSelectedProgram(value);
                  setSelectedSemester('all');
                  setSelectedSubject('all');
                }}
                disabled={selectedFaculty === 'all'}
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Program" />
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

              <Select 
                value={selectedSemester} 
                onValueChange={(value) => {
                  setSelectedSemester(value);
                  setSelectedSubject('all');
                }}
                disabled={selectedProgram === 'all'}
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesterOptions.map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Sem {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={selectedSemester === 'all'}
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 md:py-12">
              <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
              <h3 className="text-sm md:text-lg font-semibold mb-1.5 md:mb-2">No Notes Found</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                {selectedSubject !== 'all'
                  ? "No notes available for selected filters."
                  : "Please select a subject to view notes."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <CardHeader className="pb-2 p-3 md:p-6 md:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                      {getFileIcon(note.file_type, 'md')}
                      <CardTitle className="text-sm md:text-lg line-clamp-2">{note.title}</CardTitle>
                    </div>
                    {note.is_verified && (
                      <Badge variant="secondary" className="ml-2 text-[10px] md:text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  {note.description && (
                    <CardDescription className="line-clamp-2 text-xs md:text-sm">
                      {note.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-2 md:space-y-4 p-3 pt-0 md:p-6 md:pt-0">
                  <div className="flex items-center justify-between text-[11px] md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      {formatDate(note.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      {note.download_count}
                    </div>
                  </div>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] md:text-xs px-1.5">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-[10px] md:text-xs px-1.5">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-[11px] md:text-sm text-muted-foreground">
                      {note.file_size && formatFileSize(note.file_size)}
                    </div>
                    {note.rating_count > 0 && (
                      <div className="flex items-center gap-1 text-[11px] md:text-sm">
                        <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-yellow-400 text-yellow-400" />
                        {(note.rating_sum / note.rating_count).toFixed(1)}
                        <span className="text-muted-foreground">({note.rating_count})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 h-8 md:h-9 text-xs md:text-sm" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(note.file_url, '_blank');
                      }}
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Download
                    </Button>
                    {note.file_type === 'application/pdf' && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 md:h-9 text-xs md:text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(note.file_url, '_blank');
                        }}
                      >
                        Preview
                      </Button>
                    )}
                  </div>

                  {note.uploader_name && (
                    <div className="text-[10px] md:text-xs text-muted-foreground border-t pt-2">
                      By {note.uploader_name}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}