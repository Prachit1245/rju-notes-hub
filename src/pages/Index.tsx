import { Link } from 'react-router-dom';
import { BookOpen, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NoticeBoard from '@/components/NoticeBoard';
import rjuLogo from '@/assets/rju-logo.webp';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section with Logo Background */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary-glow))] to-[hsl(var(--accent))]">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${rjuLogo})`,
              backgroundSize: '40%',
              filter: 'brightness(2) contrast(0.8)'
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]"></div>
        
        <div className="container relative z-10 px-4">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              RJU Student Notes
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto drop-shadow-lg font-medium">
              Access comprehensive study materials organized by faculty, program, and semester. 
              Stay updated with the latest notices from Rajarshi Janak University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/notes">
                <Button 
                  size="lg" 
                  className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-elegant px-8 py-6 text-lg font-semibold"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/upload">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-[hsl(var(--primary))] transition-all duration-300 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Study Materials
                </CardTitle>
                <CardDescription>
                  Access notes organized by faculty, program, semester, and subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find comprehensive study materials for all RJU programs including BCA, BIT, BSc CSIT, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Easy Upload
                </CardTitle>
                <CardDescription>
                  Admin-controlled note upload system for quality assurance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure upload system ensures only verified and quality notes are available to students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Real-time Notices
                </CardTitle>
                <CardDescription>
                  Stay updated with latest notices from RJU
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications about exam schedules, results, and important announcements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NoticeBoard />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/notes">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Notes
                    </Button>
                  </Link>
                  <Link to="/upload">
                    <Button className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Notes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Notes</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faculties</span>
                      <span className="font-semibold">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Programs</span>
                      <span className="font-semibold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
