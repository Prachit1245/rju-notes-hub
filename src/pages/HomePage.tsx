import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Upload, 
  Download, 
  Search, 
  TrendingUp, 
  Clock,
  Users,
  FileText,
  Bell,
  Star,
  Sparkles,
  Zap,
  ArrowRight,
  GraduationCap,
  Library,
  Rocket,
  Heart,
  ChevronRight,
  Filter,
  Folder,
  BookMarked
} from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import VisitorCounter from '@/components/VisitorCounter';
import { useFaculties, usePrograms, useSubjects, useNotes, useNotices } from '@/hooks/useSupabaseData';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Browse section state
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  
  // Fetch real data
  const { faculties } = useFaculties();
  const { programs } = usePrograms(selectedFaculty || undefined);
  const { subjects } = useSubjects(selectedProgram || undefined, selectedSemester ? parseInt(selectedSemester) : undefined);
  const { notes: allNotes, loading: notesLoading } = useNotes();
  const { notices } = useNotices();
  
  // Get semester options based on selected program
  const selectedProgramData = programs.find(p => p.id === selectedProgram);
  const semesterOptions = selectedProgramData 
    ? Array.from({ length: selectedProgramData.total_semesters }, (_, i) => i + 1)
    : [];

  // Filter notes based on search
  const filteredNotes = allNotes.filter(note =>
    searchQuery === '' || 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get latest and trending notes
  const latestNotes = [...allNotes].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 4);
  
  const trendingNotes = [...allNotes].sort((a, b) => b.download_count - a.download_count).slice(0, 4);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/notes');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBrowseNotes = () => {
    const params = new URLSearchParams();
    if (selectedFaculty) params.set('faculty', selectedFaculty);
    if (selectedProgram) params.set('program', selectedProgram);
    if (selectedSemester) params.set('semester', selectedSemester);
    navigate(`/notes?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Hero Section */}
      <section className="relative py-12 md:py-24 lg:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg" />
        
        <div className="absolute inset-0">
          <div className="glow-line glow-line-1" />
          <div className="glow-line glow-line-2" />
          <div className="glow-line glow-line-3" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-electric-purple/20 to-electric-cyan/20 border border-electric-purple/30 mb-4 md:mb-6 backdrop-blur-xl">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-electric-purple animate-pulse" />
              <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-electric-purple to-electric-cyan bg-clip-text text-transparent">
                Nepal's #1 Student Notes Platform
              </span>
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-electric-cyan animate-pulse" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-3 md:mb-6 leading-tight">
              <span className="hero-title-gradient animated-underline">RJU</span>
              <span className="text-foreground"> Notes</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed px-4">
              Free access to <span className="text-electric-purple font-semibold">study materials</span>, 
              <span className="text-electric-cyan font-semibold"> old questions</span>, and 
              <span className="text-electric-green font-semibold"> lecture notes</span>
            </p>

            {/* Search Box - Working */}
            <div className="max-w-2xl mx-auto mb-6 md:mb-10 px-4">
              <div className="search-box-premium">
                <div className="relative flex flex-col sm:flex-row gap-2 md:gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search notes, subjects, topics..."
                      className="pl-10 md:pl-12 py-5 md:py-6 text-sm md:text-base bg-background/80 backdrop-blur-xl border-2 border-border/50 focus:border-electric-purple rounded-xl md:rounded-2xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="btn-premium py-5 md:py-6 px-6 md:px-8 rounded-xl md:rounded-2xl"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link to="/notes">
                <Button size="lg" className="w-full sm:w-auto btn-glow-primary group text-sm md:text-base">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Notes
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto btn-glow-secondary group text-sm md:text-base">
                  <Upload className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Upload Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Animated Elements - Desktop Only */}
        <div className="hidden lg:block">
          <div className="hero-decoration floating-element-1">
            <div className="hero-book" />
          </div>
          <div className="hero-decoration floating-element-2">
            <div className="hero-graduation" />
          </div>
          <div className="hero-decoration floating-element-3">
            <div className="hero-pencil" />
          </div>
          <div className="hero-decoration floating-element-4">
            <div className="hero-notebook" />
          </div>
          <div className="hero-decoration" style={{ top: '15%', right: '20%' }}>
            <div className="hero-star" />
          </div>
          <div className="hero-decoration" style={{ bottom: '40%', left: '8%' }}>
            <div className="hero-star" />
          </div>
        </div>
        
        {/* Sparkles */}
        <div className="sparkle-container absolute inset-0 pointer-events-none hidden lg:block">
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider" />

      {/* Stats Section */}
      <section className="relative py-6 md:py-16 -mt-8 md:-mt-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
            {[
              { value: allNotes.length > 0 ? `${allNotes.length}+` : '2,500+', label: 'Notes', icon: FileText, color: 'purple', delay: '0ms' },
              { value: faculties.length > 0 ? faculties.length.toString() : '15', label: 'Faculties', icon: GraduationCap, color: 'cyan', delay: '100ms' },
              { value: '5,000+', label: 'Students', icon: Users, color: 'green', delay: '200ms' },
              { value: '100%', label: 'Free', icon: Heart, color: 'pink', delay: '300ms' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="stat-card-premium"
                style={{ animationDelay: stat.delay }}
              >
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <stat.icon className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Notes by Faculty Section - NEW DESIGN */}
      <section className="py-8 md:py-16 relative">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-6 md:mb-10">
            <Badge className="mb-3 md:mb-4 bg-electric-cyan/10 text-electric-cyan border-electric-cyan/30">
              <Folder className="h-3 w-3 mr-1" />
              Browse
            </Badge>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
              Study <span className="hero-title-gradient">Notes</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Access study materials by faculty, program & semester
            </p>
          </div>

          <div className="browse-section-card">
            <div className="browse-section-inner">
              {/* Faculty Selection */}
              <div className="browse-filters">
                <div className="filter-group">
                  <label className="filter-label">
                    <GraduationCap className="h-4 w-4" />
                    Faculty
                  </label>
                  <Select value={selectedFaculty} onValueChange={(value) => {
                    setSelectedFaculty(value);
                    setSelectedProgram('');
                    setSelectedSemester('');
                  }}>
                    <SelectTrigger className="browse-select">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map(faculty => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          <span className="font-medium">{faculty.code}</span>
                          <span className="text-muted-foreground ml-2">- {faculty.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <BookMarked className="h-4 w-4" />
                    Program
                  </label>
                  <Select 
                    value={selectedProgram} 
                    onValueChange={(value) => {
                      setSelectedProgram(value);
                      setSelectedSemester('');
                    }}
                    disabled={!selectedFaculty}
                  >
                    <SelectTrigger className="browse-select">
                      <SelectValue placeholder={selectedFaculty ? "Select Program" : "Select Faculty First"} />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          <span className="font-medium">{program.code}</span>
                          <span className="text-muted-foreground ml-2">- {program.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <BookOpen className="h-4 w-4" />
                    Semester
                  </label>
                  <Select 
                    value={selectedSemester} 
                    onValueChange={setSelectedSemester}
                    disabled={!selectedProgram}
                  >
                    <SelectTrigger className="browse-select">
                      <SelectValue placeholder={selectedProgram ? "Select Semester" : "Select Program First"} />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject Cards */}
              {selectedSemester && subjects.length > 0 && (
                <div className="subjects-grid">
                  <h3 className="subjects-title">
                    <BookOpen className="h-4 w-4 text-electric-purple" />
                    Available Subjects
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                    {subjects.map(subject => (
                      <Link 
                        key={subject.id} 
                        to={`/notes?subject=${subject.id}`}
                        className="subject-card"
                      >
                        <span className="subject-code">{subject.code}</span>
                        <span className="subject-name">{subject.name}</span>
                        {subject.credits && (
                          <span className="subject-credits">{subject.credits} Credits</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Button */}
              <div className="browse-action">
                <Button 
                  size="lg" 
                  className="btn-premium group"
                  onClick={handleBrowseNotes}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Browse Notes
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-8 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="mb-3 md:mb-4 bg-electric-purple/10 text-electric-purple border-electric-purple/30">
              <Zap className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
              Why Choose <span className="hero-title-gradient">RJU Notes?</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your studies
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-card bento-card-large group">
              <div className="bento-card-glow bento-glow-purple" />
              <div className="bento-icon bento-icon-purple">
                <Download className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h3 className="bento-title">Instant Downloads</h3>
              <p className="bento-desc">
                Access thousands of notes, slides, and study materials instantly. No signup required.
              </p>
              <div className="bento-stat">
                <span className="bento-stat-value">
                  {allNotes.reduce((acc, note) => acc + note.download_count, 0).toLocaleString()}+
                </span>
                <span className="bento-stat-label">Downloads</span>
              </div>
            </div>

            <div className="bento-card bento-card-medium group">
              <div className="bento-card-glow bento-glow-cyan" />
              <div className="bento-icon bento-icon-cyan">
                <Upload className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="bento-title">Share & Contribute</h3>
              <p className="bento-desc">
                Help your juniors by uploading your notes
              </p>
            </div>

            <div className="bento-card bento-card-medium group">
              <div className="bento-card-glow bento-glow-green" />
              <div className="bento-icon bento-icon-green">
                <Bell className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="bento-title">Latest Updates</h3>
              <p className="bento-desc">
                Get instant notifications for new materials
              </p>
            </div>

            <div className="bento-card bento-card-small group">
              <div className="bento-icon-small bento-icon-orange">
                <Star className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="bento-title-small">Top Rated</span>
            </div>

            <div className="bento-card bento-card-small group">
              <div className="bento-icon-small bento-icon-pink">
                <Rocket className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="bento-title-small">Fast & Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notes Section */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-background to-card/50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="section-icon-wrapper">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-electric-purple" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">Latest Notes</h2>
                <p className="text-muted-foreground text-xs md:text-base">Recently uploaded materials</p>
              </div>
            </div>
            <Link to="/notes">
              <Button variant="outline" className="btn-view-all group text-xs md:text-sm">
                View All
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {notesLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : latestNotes.length > 0 ? (
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 snap-x snap-mandatory scrollbar-hide">
              {latestNotes.map((note) => (
                <div key={note.id} className="flex-shrink-0 w-[75vw] md:w-auto snap-center">
                  <NoteCard 
                    title={note.title}
                    subject={note.description || "Study Material"}
                    semester={note.created_at}
                    faculty="Notes"
                    fileType={note.file_type.includes('pdf') ? 'pdf' : note.file_type.includes('doc') ? 'doc' : 'ppt'}
                    uploadDate={note.created_at}
                    downloads={note.download_count}
                    rating={note.rating_count > 0 ? note.rating_sum / note.rating_count : 0}
                    size={note.file_size ? `${(note.file_size / (1024 * 1024)).toFixed(1)} MB` : undefined}
                    contributor={note.uploader_name}
                    noteId={note.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notes available yet. Be the first to upload!</p>
                <Link to="/upload" className="mt-4 inline-block">
                  <Button variant="outline">Upload Notes</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-8 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="section-icon-wrapper section-icon-trending">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-electric-orange" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground text-xs md:text-base">Most downloaded this week</p>
              </div>
            </div>
            <Link to="/notes">
              <Button variant="outline" className="btn-view-all group text-xs md:text-sm">
                View All
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {trendingNotes.length > 0 && (
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 snap-x snap-mandatory scrollbar-hide">
              {trendingNotes.map((note) => (
                <div key={note.id} className="flex-shrink-0 w-[75vw] md:w-auto snap-center">
                  <NoteCard 
                    title={note.title}
                    subject={note.description || "Study Material"}
                    semester={note.created_at}
                    faculty="Notes"
                    fileType={note.file_type.includes('pdf') ? 'pdf' : note.file_type.includes('doc') ? 'doc' : 'ppt'}
                    uploadDate={note.created_at}
                    downloads={note.download_count}
                    rating={note.rating_count > 0 ? note.rating_sum / note.rating_count : 0}
                    size={note.file_size ? `${(note.file_size / (1024 * 1024)).toFixed(1)} MB` : undefined}
                    contributor={note.uploader_name}
                    noteId={note.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notices Section */}
      {notices.length > 0 && (
        <section className="py-8 md:py-16 bg-gradient-to-b from-card/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-6 md:mb-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="section-icon-wrapper section-icon-notice">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 text-electric-cyan" />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">Latest Notices</h2>
                  <p className="text-muted-foreground text-xs md:text-base">Important announcements</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:gap-4 md:grid-cols-3">
              {notices.slice(0, 3).map((notice) => (
                <Card key={notice.id} className="notice-card group">
                  <CardHeader className="pb-2 md:pb-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={notice.priority === 'urgent' || notice.priority === 'high' ? "destructive" : "secondary"}
                        className={notice.priority === 'urgent' || notice.priority === 'high' ? "notice-badge-urgent" : "notice-badge"}
                      >
                        {(notice.priority === 'urgent' || notice.priority === 'high') && <Zap className="h-3 w-3 mr-1" />}
                        {notice.category}
                      </Badge>
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        {new Date(notice.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-electric-purple transition-colors line-clamp-2">
                      {notice.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="cta-section-premium">
            <div className="cta-glow" />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-foreground">
                Ready to <span className="hero-title-gradient">Start Learning?</span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
                Join thousands of students who are already using RJU Notes
              </p>
              <Link to="/notes">
                <Button size="lg" className="btn-premium group text-sm md:text-base">
                  <Rocket className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:animate-bounce" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Visitor Counter */}
      <VisitorCounter variant="footer" />
    </div>
  );
};

export default HomePage;
