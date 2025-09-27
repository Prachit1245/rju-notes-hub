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
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center text-white relative z-10">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              RJU Notes
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Free access to student notes, old questions, slides, and study materials 
              for Rajarshi Janak University students
            </p>
          </div>

          {/* Hero Search */}
          <div className="max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-rju-purple" />
                <Input
                  type="search"
                  placeholder="Search notes, subjects, or faculty..."
                  className="pl-12 py-4 text-lg text-black bg-white/95 backdrop-blur-sm border-0 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="btn-glow px-8 py-4">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-scale-in">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl float-animation">
              <div className="text-3xl md:text-4xl font-bold glow-text">2,500+</div>
              <div className="text-lg opacity-90">Notes</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl float-animation" style={{animationDelay: '0.5s'}}>
              <div className="text-3xl md:text-4xl font-bold glow-text">15</div>
              <div className="text-lg opacity-90">Faculties</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl float-animation" style={{animationDelay: '1s'}}>
              <div className="text-3xl md:text-4xl font-bold glow-text">5,000+</div>
              <div className="text-lg opacity-90">Students</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl float-animation" style={{animationDelay: '1.5s'}}>
              <div className="text-3xl md:text-4xl font-bold glow-text">Free</div>
              <div className="text-lg opacity-90">Always</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Action Cards */}
        <section className="grid md:grid-cols-3 gap-8 mb-20 -mt-10 relative z-20">
          <Card className="rainbow-border text-center p-8 hover:scale-105 transition-all duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-rju-purple to-rju-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-4 gradient-text">Download Notes</h3>
            <p className="text-muted-foreground">
              Access thousands of notes, slides, and study materials from all faculties
            </p>
          </Card>

          <Card className="rainbow-border text-center p-8 hover:scale-105 transition-all duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-rju-cyan to-rju-green rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-4 gradient-text">Share Resources</h3>
            <p className="text-muted-foreground">
              Help fellow students by uploading your notes and study materials
            </p>
          </Card>

          <Card className="rainbow-border text-center p-8 hover:scale-105 transition-all duration-500">
            <div className="w-16 h-16 bg-gradient-to-br from-rju-orange to-rju-pink rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-xl mb-4 gradient-text">Stay Updated</h3>
            <p className="text-muted-foreground">
              Get the latest university notices, exam schedules, and results
            </p>
          </Card>
        </section>

        {/* Latest Notes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rju-purple to-rju-cyan rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text">Latest Notes</h2>
            </div>
            <Button variant="outline" className="nav-link">
              View All
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockNotes.map((note, index) => (
              <NoteCard key={index} {...note} />
            ))}
          </div>
        </section>

        {/* Popular Downloads */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Popular Downloads</h2>
            </div>
            <Button variant="outline">
              View All
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockNotes.slice().sort((a, b) => b.downloads - a.downloads).map((note, index) => (
              <NoteCard key={index} {...note} />
            ))}
          </div>
        </section>

        {/* Notices */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Latest Notices</h2>
            </div>
            <Button variant="outline">
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {mockNotices.map((notice, index) => (
              <Card key={index} className="card-gradient">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={notice.urgent ? "destructive" : "secondary"}>
                      {notice.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {notice.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium leading-tight">{notice.title}</h3>
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