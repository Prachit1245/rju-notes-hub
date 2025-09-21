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
      <section className="hero-gradient py-16 px-4">
        <div className="container mx-auto text-center text-white">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              RJU Notes
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Free access to student notes, old questions, slides, and study materials 
              for Rajarshi Janak University students
            </p>
          </div>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search notes, subjects, or faculty..."
                  className="pl-10 py-3 text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" variant="secondary" className="px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm opacity-80">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm opacity-80">Faculties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-sm opacity-80">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-sm opacity-80">Always</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Action Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="card-gradient text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Download Notes</h3>
            <p className="text-muted-foreground text-sm">
              Access thousands of notes, slides, and study materials from all faculties
            </p>
          </Card>

          <Card className="card-gradient text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Share Resources</h3>
            <p className="text-muted-foreground text-sm">
              Help fellow students by uploading your notes and study materials
            </p>
          </Card>

          <Card className="card-gradient text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get the latest university notices, exam schedules, and results
            </p>
          </Card>
        </section>

        {/* Latest Notes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Latest Notes</h2>
            </div>
            <Button variant="outline">
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