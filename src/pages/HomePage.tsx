import { useState } from 'react';
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
  Filter
} from 'lucide-react';
import NoteCard from '@/components/NoteCard';

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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Bottom Glow Effect */}
      <div className="mobile-bottom-glow" />
      
      {/* Hero Section */}
      <section className="hero-gradient py-8 md:py-20 px-3 md:px-4 relative overflow-hidden">
        <div className="container mx-auto text-center text-white relative z-10">
          {/* Mobile Hero Glow */}
          <div className="mobile-hero-glow">
            <div className="mb-4 md:mb-8 animate-slide-up">
              <h1 className="text-3xl md:text-7xl font-bold mb-3 md:mb-6 gradient-text">
                RJU Notes
              </h1>
              <p className="text-sm md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed px-2">
                Free access to student notes, old questions, slides, and study materials
              </p>
            </div>
          </div>

          {/* Hero Search - Mobile Optimized */}
          <div className="max-w-3xl mx-auto mb-6 md:mb-12 animate-fade-in px-1">
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="pl-9 md:pl-12 py-2.5 md:py-4 text-sm md:text-lg text-foreground bg-background/95 backdrop-blur-sm border-0 shadow-lg rounded-xl md:rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="mobile-shimmer mobile-action-btn py-2.5 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base">
                <Search className="h-4 w-4 mr-1.5 md:mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats - Mobile Grid */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6 max-w-4xl mx-auto animate-scale-in">
            {[
              { value: '2,500+', label: 'Notes', delay: '0s' },
              { value: '15', label: 'Faculties', delay: '0.1s' },
              { value: '5,000+', label: 'Students', delay: '0.2s' },
              { value: 'Free', label: 'Always', delay: '0.3s' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="mobile-stat-card text-center p-3 md:p-6 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl float-animation"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-xl md:text-4xl font-bold glow-text">{stat.value}</div>
                <div className="text-xs md:text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-12">
        {/* Action Cards - Mobile Horizontal Scroll */}
        <section className="mb-8 md:mb-20 -mt-6 md:-mt-10 relative z-20">
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-8 snap-x snap-mandatory scrollbar-hide">
            {[
              { 
                icon: Download, 
                title: 'Download Notes', 
                desc: 'Access thousands of notes and materials',
                gradient: 'from-rju-purple to-rju-cyan',
                mobileTag: 'Popular'
              },
              { 
                icon: Upload, 
                title: 'Share Resources', 
                desc: 'Help fellow students by uploading',
                gradient: 'from-rju-cyan to-rju-green',
                mobileTag: 'New'
              },
              { 
                icon: Bell, 
                title: 'Stay Updated', 
                desc: 'Get latest notices and schedules',
                gradient: 'from-rju-orange to-rju-pink',
                mobileTag: 'Live'
              },
            ].map((item, idx) => (
              <Card 
                key={idx}
                className="mobile-gradient-card mobile-glass-card flex-shrink-0 w-[75vw] md:w-auto snap-center text-center p-4 md:p-8 hover:scale-105 transition-all duration-500 relative overflow-visible"
              >
                {/* Mobile Ribbon Tag */}
                <span className="mobile-ribbon">{item.mobileTag}</span>
                
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${item.gradient} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-6 pulse-glow`}>
                  <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="font-bold text-base md:text-xl mb-2 md:mb-4 gradient-text">{item.title}</h3>
                <p className="text-xs md:text-base text-muted-foreground line-clamp-2">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest Notes - Mobile Optimized */}
        <section className="mb-8 md:mb-16">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-rju-purple to-rju-cyan rounded-lg flex items-center justify-center mobile-floating-badge">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <h2 className="mobile-section-title">Latest Notes</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs md:text-sm nav-link">
              View All
            </Button>
          </div>
          
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-4 snap-x snap-mandatory scrollbar-hide">
            {mockNotes.map((note, index) => (
              <div key={index} className="flex-shrink-0 w-[70vw] md:w-auto snap-center">
                <div className="mobile-note-card rounded-xl md:rounded-2xl overflow-hidden">
                  <NoteCard {...note} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Downloads */}
        <section className="mb-8 md:mb-16">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary mobile-floating-badge" />
              <h2 className="mobile-section-title">Popular Downloads</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              View All
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-4 md:gap-4 snap-x snap-mandatory scrollbar-hide">
            {mockNotes.slice().sort((a, b) => b.downloads - a.downloads).map((note, index) => (
              <div key={index} className="flex-shrink-0 w-[70vw] md:w-auto snap-center">
                <div className="mobile-note-card rounded-xl md:rounded-2xl overflow-hidden">
                  <NoteCard {...note} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notices - Mobile Card Style */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-primary mobile-floating-badge" />
              <h2 className="mobile-section-title">Latest Notices</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              View All
            </Button>
          </div>

          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            {mockNotices.map((notice, index) => (
              <Card key={index} className="mobile-glass-card card-gradient">
                <CardHeader className="pb-2 md:pb-3 p-3 md:p-6">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={notice.urgent ? "destructive" : "secondary"}
                      className="text-[10px] md:text-xs mobile-floating-badge"
                    >
                      {notice.type}
                    </Badge>
                    <span className="text-[10px] md:text-sm text-muted-foreground">
                      {notice.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <h3 className="font-medium leading-tight text-sm md:text-base">{notice.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;