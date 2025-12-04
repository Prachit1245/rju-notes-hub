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
      <header className="relative min-h-[60vh] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 md:py-0">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <img 
            src={rjuLogo}
            alt=""
            className="absolute inset-0 w-full h-full object-contain opacity-50"
            style={{ objectPosition: 'center' }}
            loading="eager"
          />
        </div>
        
        <div className="container relative z-10 px-3 md:px-4">
          <div className="text-center space-y-3 md:space-y-6 animate-fade-in">
            <h1 className="text-xl leading-snug sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black md:leading-tight">
              RJU Student Notes
              <span className="block text-base font-semibold text-primary mt-1 md:hidden">Rajarshi Janak University</span>
              <span className="hidden md:inline"> - Rajarshi Janak University Study Materials</span>
            </h1>
            <p className="text-xs leading-relaxed sm:text-base md:text-lg lg:text-2xl text-black/80 max-w-3xl mx-auto font-medium md:leading-relaxed">
              <span className="md:hidden">Free notes, old questions & exam papers for RJU students. Stay updated with latest notices.</span>
              <span className="hidden md:inline">Free study materials, lecture notes, old questions, and exam papers for Rajarshi Janak University (RJU) students in Nepal. Access comprehensive notes organized by faculty, program, and semester. Stay updated with latest university notices.</span>
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-4 justify-center pt-3 md:pt-6 px-2 md:px-0">
              <Link to="/notes" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 md:h-auto px-6 md:px-8 md:py-6 text-sm md:text-lg font-semibold"
                >
                  <BookOpen className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/upload" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto h-12 md:h-auto px-6 md:px-8 md:py-6 text-sm md:text-lg font-semibold"
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
        <section className="py-6 md:py-16" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-3 md:px-4">
            <h2 id="features-heading" className="text-lg md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-12">
              Why Choose RJU Notes?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 mb-6 md:mb-16">
            <Card className="p-0 md:p-0">
              <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  Study Materials
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Notes organized by faculty, program & semester
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  Find comprehensive study materials for all RJU programs including BCA, BIT, BSc CSIT, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="p-0 md:p-0">
              <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Upload className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  Easy Upload
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Admin-controlled for quality assurance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  Secure upload system ensures only verified and quality notes are available to students.
                </p>
              </CardContent>
            </Card>

            <Card className="p-0 md:p-0">
              <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Users className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  Real-time Notices
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Stay updated with latest RJU notices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  Get instant notifications about exam schedules, results, and important announcements.
                </p>
              </CardContent>
            </Card>
          </div>
          </div>
        </section>

        {/* Notice Board Section */}
        <section className="py-6 md:py-16 bg-muted/30" aria-labelledby="notices-heading">
          <div className="max-w-7xl mx-auto px-3 md:px-4">
            <h2 id="notices-heading" className="text-lg md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-12">
              Latest University Notices
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-8">
            <div className="lg:col-span-2 order-1 lg:order-1">
              <NoticeBoard />
            </div>
            <div className="space-y-3 md:space-y-6 order-2 lg:order-2">
              <Card>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-sm md:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 md:block md:space-y-4 p-3 pt-0 md:p-6 md:pt-0">
                  <Link to="/notes" className="flex-1">
                    <Button className="w-full h-10 md:h-auto text-xs md:text-sm" variant="outline">
                      <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                      Browse Notes
                    </Button>
                  </Link>
                  <Link to="/upload" className="flex-1">
                    <Button className="w-full h-10 md:h-auto text-xs md:text-sm" variant="outline">
                      <Upload className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                      Upload Notes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-3 md:p-6">
                  <CardTitle className="text-sm md:text-xl">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                  <div className="flex justify-around md:block md:space-y-2">
                    <div className="text-center md:text-left md:flex md:justify-between">
                      <span className="block text-xs md:text-sm text-muted-foreground">Total Notes</span>
                      <span className="font-semibold text-sm md:text-base">0</span>
                    </div>
                    <div className="text-center md:text-left md:flex md:justify-between">
                      <span className="block text-xs md:text-sm text-muted-foreground">Faculties</span>
                      <span className="font-semibold text-sm md:text-base">4</span>
                    </div>
                    <div className="text-center md:text-left md:flex md:justify-between">
                      <span className="block text-xs md:text-sm text-muted-foreground">Programs</span>
                      <span className="font-semibold text-sm md:text-base">12</span>
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
