'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

// Fonction utilitaire pour combiner les classes CSS
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Set initial collapsed state based on screen width on mount
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false); // Toujours fermé sur mobile au redimensionnement
        setIsSidebarCollapsed(false); 
      } else if (window.innerWidth < 1024) { // Tablet breakpoint
        setIsMobileMenuOpen(false); // Fermer le menu mobile sur tablet
         setIsSidebarCollapsed(true); // Collapsed on tablets
      } else {
        setIsMobileMenuOpen(false); // Fermer le menu mobile sur desktop
        setIsSidebarCollapsed(false); // Expanded on large screens
      }
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Header fixe en haut avec bouton menu mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-background px-4 md:px-6 shadow-sm border-b">
        {/* Mobile menu button - shown only on md screens and below */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Titre/Logo pour desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <h1 className="text-lg font-semibold">BackendAuth Dashboard</h1>
        </div>

        {/* Header component pour le contenu à droite */}
        <div className="flex items-center space-x-4">
          <Header />
        </div>
      </div>

      {/* Desktop/Tablet Sidebar - shown only on md screens and above */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 top-16 z-40 h-[calc(100vh-4rem)] transform transition-transform duration-200 ease-in-out',
          isSidebarCollapsed ? 'w-20' : 'w-64',
          'hidden md:flex'
        )}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      </div>

       {/* Mobile Overlay Sidebar - shown only on md screens and below */}
       <div
        className={cn(
          'fixed inset-y-0 left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)] transform transition-transform duration-200 ease-in-out md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar isMobile setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </div>

      {/* Overlay for mobile sidebar - shown only on md screens and below */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <main
        className={cn(
          'flex-1 overflow-y-auto transition-all duration-200 ease-in-out pt-16',
          // Adjust margin based on the width of the desktop/tablet sidebar when it is shown
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        {/* Content padding inside the main area */}
        <div className="mx-auto max-w-7xl p-4 md:p-6 pb-20 md:pb-24">{children}</div>
      </main>
    </div>
  );
}