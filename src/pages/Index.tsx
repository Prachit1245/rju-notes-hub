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
        <div className="absolute inset-0 opacity-15">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${rjuLogo})`,
              backgroundSize: '40%',
              filter: 'brightness(2) contrast(0.8)'
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
        
        <div className="container relative z-10 px-4">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] leading-tight tracking-tight">
              RJU Student Notes
            </h1>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto border border-white/20">
              <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg leading-relaxed">
                Access comprehensive study materials organized by faculty, program, and semester. 
                <br />
                <span className="text-yellow-300 font-extrabold">Stay updated</span> with the latest notices from Rajarshi Janak University.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/notes">
                <Button 
                  size="lg" 
                  className="bg-white text-[hsl(var(--primary))] hover:bg-yellow-300 hover:text-[hsl(var(--primary))] hover:scale-105 transition-all duration-300 shadow-2xl px-10 py-7 text-xl font-black border-4 border-white/50"
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/upload">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-4 border-white bg-[hsl(var(--primary))]/80 text-white hover:bg-white hover:text-[hsl(var(--primary))] transition-all duration-300 px-10 py-7 text-xl font-black backdrop-blur-sm shadow-2xl"
                >
                  <Upload className="mr-3 h-6 w-6" />
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
