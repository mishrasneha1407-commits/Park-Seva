import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, User, LogOut, Settings, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">Easy Park</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/map" className="text-sm font-medium hover:text-primary transition-colors">
            Find Parking
          </Link>
          <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">
            How it Works
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
            Support
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.full_name || 'User'}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/bookings')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <AuthModal
                trigger={<Button variant="ghost">Sign In</Button>}
                defaultMode="signin"
              />
              <AuthModal
                trigger={<Button>Get Started</Button>}
                defaultMode="signup"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}