import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Mail, 
  Shield, 
  Users, 
  BookOpen, 
  Target,
  Github,
  Linkedin
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient py-12 md:py-20 px-4">
        <div className="container mx-auto text-center text-white">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4">
              About RJU Notes
            </h1>
            <p className="text-base md:text-xl opacity-90 max-w-3xl mx-auto px-2">
              A student-centric platform created to help Rajarshi Janak University students 
              access quality study materials and stay updated with university notices.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Creator Section */}
        <section className="mb-8 md:mb-16">
          <Card className="card-gradient max-w-4xl mx-auto">
            <CardHeader className="text-center pb-3 md:pb-4 p-4 md:p-6">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Heart className="h-8 md:h-10 w-8 md:w-10 text-white" fill="currentColor" />
              </div>
              <CardTitle className="text-xl md:text-3xl mb-2 px-2">Created with ❤️ by Prachit Regmi</CardTitle>
              <Badge className="academic-badge text-sm md:text-lg px-3 md:px-4 py-1 md:py-2">Student Developer</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-4 md:space-y-6 p-4 md:p-6">
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                This platform was created by <strong>Prachit Regmi</strong>, a dedicated student who 
                understands the challenges of finding quality study materials and staying updated 
                with university notices.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Mission Section */}
        <section className="mb-8 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <Card className="card-gradient text-center">
              <CardHeader className="p-4 md:p-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Target className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg md:text-xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground">
                  To provide free and easy access to quality study materials for all RJU students, 
                  promoting collaborative learning and academic success.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient text-center">
              <CardHeader className="p-4 md:p-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">For Students</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground">
                  Created by students, for students. We understand your needs and challenges, 
                  and we're here to support your academic journey.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient text-center">
              <CardHeader className="p-4 md:p-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Free Knowledge</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground">
                  All resources are completely free. Knowledge should be accessible to everyone, 
                  regardless of their financial situation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-8 md:mb-16">
          <Card className="card-gradient border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 md:h-6 w-5 md:w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg md:text-2xl text-orange-800">Non-Commercial Purpose</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
              <div className="bg-white/50 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
                <p className="text-orange-800 font-medium">
                  <strong>Important:</strong> This website is created solely for helping students and is not intended for earning money.
                </p>
                
                <div className="space-y-2">
                  <p className="text-orange-700">
                    • All study materials are shared for educational purposes only
                  </p>
                  <p className="text-orange-700">
                    • We respect intellectual property rights
                  </p>
                  <p className="text-orange-700">
                    • No commercial use or profit motive involved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Copyright Notice */}
        <section className="mb-16">
          <Card className="card-gradient border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-2xl text-red-800 flex items-center gap-3">
                <Mail className="h-6 w-6" />
                Copyright Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/50 rounded-lg p-6 space-y-4">
                <p className="text-red-800 font-medium">
                  If you believe any content on this website infringes your copyright, please contact us immediately.
                </p>
                
                <div className="space-y-3">
                  <p className="text-red-700">
                    <strong>We will:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-red-700 ml-4">
                    <li>Review your complaint promptly</li>
                    <li>Remove the content if it violates copyright</li>
                    <li>Take necessary action to prevent future issues</li>
                    <li>Respond to your concerns within 24-48 hours</li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.location.href = 'mailto:prachitregmi456@gmail.com?subject=Copyright Concern'}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us for Copyright Issues
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What We Offer</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="card-gradient text-center">
              <CardContent className="p-4 md:p-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <BookOpen className="h-5 md:h-6 w-5 md:w-6 text-blue-600" />
                </div>
                <h3 className="text-sm md:text-base font-semibold mb-2">Study Materials</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Notes, slides, and resources from all faculties
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Students helping students succeed
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Notices</h3>
                <p className="text-sm text-muted-foreground">
                  Latest updates from RJU website
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-orange-600" fill="currentColor" />
                </div>
                <h3 className="font-semibold mb-2">Free Forever</h3>
                <p className="text-sm text-muted-foreground">
                  No hidden costs, completely free
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;