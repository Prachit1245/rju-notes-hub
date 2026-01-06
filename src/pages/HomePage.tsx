import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Eye,
  ChevronRight
} from 'lucide-react';
import NoteCard from '@/components/NoteCard';
import VisitorCounter from '@/components/VisitorCounter';

// Mock data
const mockNotes = [
  {
    title: "Data Structures and Algorithms Complete Notes",
    subject: "Data Structures",
    semester: "3",
    faculty: "CSIT",
    fileType: "pdf" as const,
    uploadDate: "2024-01-15",
    downloads: 1245,
    rating: 4.8,
    contributor: "Rajesh Kumar",
    size: "2.4 MB"
  },
  {
    title: "Database Management Systems Lab Manual",
    subject: "DBMS",
    semester: "4",
    faculty: "CSIT",
    fileType: "doc" as const,
    uploadDate: "2024-01-12",
    downloads: 892,
    rating: 4.6,
    contributor: "Priya Sharma",
    size: "1.8 MB"
  },
  {
    title: "Computer Networks Presentation Slides",
    subject: "Computer Networks",
    semester: "5",
    faculty: "CSIT",
    fileType: "ppt" as const,
    uploadDate: "2024-01-10",
    downloads: 634,
    rating: 4.5,
    size: "3.2 MB"
  },
  {
    title: "Microprocessor and Assembly Language Notes",
    subject: "Microprocessor",
    semester: "3",
    faculty: "CSIT",
    fileType: "pdf" as const,
    uploadDate: "2024-01-08",
    downloads: 567,
    rating: 4.7,
    contributor: "Amit Shrestha",
    size: "1.9 MB"
  }
];

const mockNotices = [
  {
    title: "Mid-term Examination Schedule Released",
    date: "2024-01-15",
    type: "Exam",
    urgent: true
  },
  {
    title: "Registration Open for Industrial Visit",
    date: "2024-01-12",
    type: "Event",
    urgent: false
  },
  {
    title: "Semester Results Published",
    date: "2024-01-10",
    type: "Result",
    urgent: true
  }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative py-16 md:py-24 lg:py-32 flex items-center justify-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 hero-grid-bg" />
        
        {/* Glowing Lines */}
        <div className="absolute inset-0">
          <div className="glow-line glow-line-1" />
          <div className="glow-line glow-line-2" />
          <div className="glow-line glow-line-3" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-electric-purple/20 to-electric-cyan/20 border border-electric-purple/30 mb-6 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-electric-purple animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-electric-purple to-electric-cyan bg-clip-text text-transparent">
                Nepal's #1 Student Notes Platform
              </span>
              <Sparkles className="h-4 w-4 text-electric-cyan animate-pulse" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-8xl font-black mb-4 md:mb-6 leading-tight">
              <span className="hero-title-gradient">RJU</span>
              <br className="md:hidden" />
              <span className="text-foreground"> Notes</span>
            </h1>

            {/* Subtitle with Typewriter Effect */}
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
              Free access to <span className="text-electric-purple font-semibold">study materials</span>, 
              <span className="text-electric-cyan font-semibold"> old questions</span>, and 
              <span className="text-electric-green font-semibold"> lecture notes</span>
            </p>

            {/* Search Box - Premium Design */}
            <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-4">
              <div className="search-box-premium">
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search notes, subjects, topics..."
                      className="pl-12 py-6 text-base bg-background/80 backdrop-blur-xl border-2 border-border/50 focus:border-electric-purple rounded-2xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="lg" className="btn-premium py-6 px-8 rounded-2xl">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-10">
              <Link to="/notes">
                <Button size="lg" className="w-full sm:w-auto btn-glow-primary group">
                  <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Notes
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto btn-glow-secondary group">
                  <Upload className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Upload Notes
                </Button>
              </Link>
            </div>

            {/* Visitor Counter */}
            <VisitorCounter />
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hidden md:block">
          <div className="floating-element floating-element-1">
            <FileText className="h-8 w-8 text-electric-purple" />
          </div>
          <div className="floating-element floating-element-2">
            <GraduationCap className="h-10 w-10 text-electric-cyan" />
          </div>
          <div className="floating-element floating-element-3">
            <Library className="h-8 w-8 text-electric-green" />
          </div>
          <div className="floating-element floating-element-4">
            <Star className="h-6 w-6 text-electric-orange" />
          </div>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="relative py-8 md:py-16 -mt-20 md:-mt-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { value: '2,500+', label: 'Notes', icon: FileText, color: 'purple', delay: '0ms' },
              { value: '15', label: 'Faculties', icon: GraduationCap, color: 'cyan', delay: '100ms' },
              { value: '5,000+', label: 'Students', icon: Users, color: 'green', delay: '200ms' },
              { value: '100%', label: 'Free', icon: Heart, color: 'pink', delay: '300ms' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="stat-card-premium"
                style={{ animationDelay: stat.delay }}
              >
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="mb-4 bg-electric-purple/10 text-electric-purple border-electric-purple/30">
              <Zap className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="hero-title-gradient">RJU Notes?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your studies, all in one place
            </p>
          </div>

          <div className="bento-grid">
            {/* Large Feature Card */}
            <div className="bento-card bento-card-large group">
              <div className="bento-card-glow bento-glow-purple" />
              <div className="bento-icon bento-icon-purple">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="bento-title">Instant Downloads</h3>
              <p className="bento-desc">
                Access thousands of notes, slides, and study materials instantly. No signup required for basic access.
              </p>
              <div className="bento-stat">
                <span className="bento-stat-value">50K+</span>
                <span className="bento-stat-label">Downloads</span>
              </div>
            </div>

            {/* Medium Cards */}
            <div className="bento-card bento-card-medium group">
              <div className="bento-card-glow bento-glow-cyan" />
              <div className="bento-icon bento-icon-cyan">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="bento-title">Share & Contribute</h3>
              <p className="bento-desc">
                Help your juniors by uploading your notes and materials
              </p>
            </div>

            <div className="bento-card bento-card-medium group">
              <div className="bento-card-glow bento-glow-green" />
              <div className="bento-icon bento-icon-green">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="bento-title">Real-time Updates</h3>
              <p className="bento-desc">
                Get instant notifications for new materials and notices
              </p>
            </div>

            {/* Small Cards */}
            <div className="bento-card bento-card-small group">
              <div className="bento-icon-small bento-icon-orange">
                <Star className="h-5 w-5" />
              </div>
              <span className="bento-title-small">Top Rated</span>
            </div>

            <div className="bento-card bento-card-small group">
              <div className="bento-icon-small bento-icon-pink">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="bento-title-small">Fast & Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notes Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-card/50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="section-icon-wrapper">
                <Clock className="h-5 w-5 text-electric-purple" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold">Latest Notes</h2>
                <p className="text-muted-foreground text-sm md:text-base">Recently uploaded materials</p>
              </div>
            </div>
            <Link to="/notes">
              <Button variant="outline" className="btn-view-all group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Notes Grid with Horizontal Scroll on Mobile */}
          <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 snap-x snap-mandatory scrollbar-hide">
            {mockNotes.map((note, index) => (
              <div key={index} className="flex-shrink-0 w-[80vw] md:w-auto snap-center">
                <NoteCard {...note} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="section-icon-wrapper section-icon-trending">
                <TrendingUp className="h-5 w-5 text-electric-orange" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground text-sm md:text-base">Most downloaded this week</p>
              </div>
            </div>
            <Link to="/notes">
              <Button variant="outline" className="btn-view-all group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 snap-x snap-mandatory scrollbar-hide">
            {mockNotes.slice().sort((a, b) => b.downloads - a.downloads).map((note, index) => (
              <div key={index} className="flex-shrink-0 w-[80vw] md:w-auto snap-center">
                <NoteCard {...note} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-card/50 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="section-icon-wrapper section-icon-notice">
                <Bell className="h-5 w-5 text-electric-cyan" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bold">Latest Notices</h2>
                <p className="text-muted-foreground text-sm md:text-base">Important announcements</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {mockNotices.map((notice, index) => (
              <Card key={index} className="notice-card group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={notice.urgent ? "destructive" : "secondary"}
                      className={notice.urgent ? "notice-badge-urgent" : "notice-badge"}
                    >
                      {notice.urgent && <Zap className="h-3 w-3 mr-1" />}
                      {notice.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-base md:text-lg group-hover:text-electric-purple transition-colors">
                    {notice.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="cta-section-premium">
            <div className="cta-glow" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                Ready to <span className="hero-title-gradient">Start Learning?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students who are already using RJU Notes to excel in their studies
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/notes">
                  <Button size="lg" className="btn-premium group">
                    <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
