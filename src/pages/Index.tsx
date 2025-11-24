import { Link } from 'react-router-dom';
import { BookOpen, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NoticeBoard from '@/components/NoticeBoard';
import rjuLogo from '@/assets/rju-notes-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section with Logo Background */}
      <header className="relative min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <img 
            src={rjuLogo}
            alt=""
            className="absolute inset-0 w-full h-full object-contain opacity-50"
            style={{ objectPosition: 'center' }}
            loading="eager"
          />
        </div>
        
        <div className="container relative z-10 px-4">
          <div className="text-center space-y-4 md:space-y-6 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black leading-tight px-2">
              RJU Student Notes - Rajarshi Janak University Study Materials
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-black/80 max-w-3xl mx-auto font-medium leading-relaxed px-4">
              Free study materials, lecture notes, old questions, and exam papers for Rajarshi Janak University (RJU) students in Nepal. 
              Access comprehensive notes organized by faculty, program, and semester. Stay updated with latest university notices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6">
              <Link to="/notes" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold"
                >
                  <BookOpen className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/upload" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold"
                >
                  <Upload className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Upload Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main>
        <section className="py-8 md:py-16" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="features-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
              Why Choose RJU Notes?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
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
        <section className="py-8 md:py-16 bg-muted/30" aria-labelledby="notices-heading">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="notices-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
              Latest University Notices
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2">
              <NoticeBoard />
            </div>
            <div className="space-y-4 md:space-y-6">
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
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
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
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
      </main>
    </div>
  );
};

export default Index;
