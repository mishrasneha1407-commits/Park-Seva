import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Menu, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Easy Park</h1>
              <p className="text-xs text-muted-foreground">Park Smarter</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-smooth">
              Pricing
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden sm:flex">
              Sign In
            </Button>
            <Button className="gradient-primary text-white border-0 hover:opacity-90 transition-smooth shadow-glow">
              Get Started
            </Button>
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;