import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, BookOpen, Bell, Home, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import rjuLogo from '@/assets/rju-notes-logo.png';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/notes', label: 'Notes', icon: BookOpen },
    { href: '/notices', label: 'Notices', icon: Bell },
    { href: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 md:h-18 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <img 
              src={rjuLogo} 
              alt="RJU Notes Logo" 
              className="h-10 w-10 md:h-11 md:w-11 transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-electric-purple/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="font-bold text-lg md:text-xl">
            <span className="hero-title-gradient">RJU</span>
            <span className="text-foreground"> Notes</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive(item.href) 
                    ? "bg-electric-purple/10 text-electric-purple" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Search Bar & Theme Toggle - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-[280px] pl-10 bg-muted/50 border-border/50 rounded-xl focus:border-electric-purple"
            />
          </div>
          <Button className="btn-premium rounded-xl">
            <Sparkles className="h-4 w-4 mr-2" />
            Search
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile: Theme Toggle + Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu - Premium Design */}
      {isMobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden animate-fade-in">
          <div className="container space-y-4 px-4 py-4">
            {/* Mobile Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="pl-10 h-11 bg-muted/50 border-border/50 rounded-xl"
                />
              </div>
              <Button className="h-11 px-4 btn-premium rounded-xl">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Navigation Links - Grid Style */}
            <div className="grid grid-cols-4 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs font-medium transition-all duration-300",
                      isActive(item.href)
                        ? "bg-gradient-to-br from-electric-purple to-hot-pink text-white shadow-lg shadow-electric-purple/25"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;