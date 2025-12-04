import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, BookOpen, Bell, Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1.5 md:space-x-2">
          <img 
            src={rjuLogo} 
            alt="RJU Notes Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div className="font-bold text-sm md:text-base">
            <span className="text-primary">RJU</span> Notes
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-[300px] pl-8"
            />
          </div>
          <Button variant="outline" size="sm">
            Search
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container space-y-3 px-3 py-3">
            {/* Mobile Search */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 px-3">
                Search
              </Button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-4 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center space-y-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
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