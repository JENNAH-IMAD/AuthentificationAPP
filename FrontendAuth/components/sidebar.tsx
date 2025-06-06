'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  LogOut,
  Settings,
  UserCircle,
  ChevronRight,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Fonction utilitaire pour combiner les classes CSS
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

export default function Sidebar({ isMobile, setIsMobileMenuOpen, isCollapsed, setIsSidebarCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <aside className="flex h-screen w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const isAdmin = user.roles.includes('Admin');

  const mainNavItems = [
    {
      name: 'Dashboard',
      href: '/home',
      icon: LayoutDashboard,
      active: pathname === '/home',
      show: true,
    },
    {
      name: 'Gestion Utilisateurs',
      href: '/users',
      icon: Users,
      active: pathname.startsWith('/users'),
      show: isAdmin,
    },
  ];

  const settingsNavItems = [
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
      show: true,
    },
  ];

  const handleLinkClick = () => {
    // Close mobile menu on link click
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r bg-background text-foreground",
      isMobile ? "w-64" : (isCollapsed ? "w-20" : "w-64"),
      isMobile && "fixed inset-y-0 left-0 z-40 transform transition-transform ease-in-out"
    )}>
      {/* Header avec logo/titre */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/home" className={cn("flex items-center space-x-2 transition-opacity", isCollapsed && !isMobile && "opacity-0 w-0")}>
          <Shield className="h-6 w-6 text-primary" />
          {(!isCollapsed || isMobile) && <span className="text-lg font-semibold tracking-tight">BackendAuth</span>}
        </Link>
        {/* Toggle button shown only on desktop/tablet */}
        {!isMobile && (
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed?.(!isCollapsed)}
                className={cn("ml-auto h-8 w-8 transition-transform", isCollapsed && "rotate-180")}
                aria-label="Toggle sidebar"
             >
                 <ChevronRight className="h-4 w-4" />
             </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 py-2">
        <div className="space-y-1">
          {/* Section MAIN */}
          <h2 className={cn("mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground transition-opacity", isCollapsed && !isMobile && "opacity-0")}>
            PRINCIPAL
          </h2>
          <div className="space-y-1">
            {mainNavItems.map((item) =>
              item.show ? (
                <TooltipProvider key={item.name} delayDuration={0}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          item.active
                            ? "bg-accent text-accent-foreground"
                            : "transparent",
                          isCollapsed && !isMobile && "justify-center px-2",
                          isMobile && "justify-start px-3"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-3")} />
                        <span className={cn("transition-opacity", isCollapsed && !isMobile && "opacity-0 w-0", isMobile && "w-auto")}>{item.name}</span>
                        {!isCollapsed && !isMobile && <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />}
                      </Link>
                    </TooltipTrigger>
                    {!isMobile && isCollapsed && (
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ) : null
            )}
          </div>

          <Separator className={cn("my-4 transition-opacity", isCollapsed && !isMobile && "opacity-0")} />

          {/* Section PARAMÈTRES */}
          <h2 className={cn("mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground transition-opacity", isCollapsed && !isMobile && "opacity-0")}>
            PARAMÈTRES
          </h2>
          <div className="space-y-1">
            {settingsNavItems.map((item) =>
              item.show ? (
                <TooltipProvider key={item.name} delayDuration={0}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          item.active
                            ? "bg-accent text-accent-foreground"
                            : "transparent",
                          isCollapsed && !isMobile && "justify-center px-2",
                          isMobile && "justify-start px-3"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-3")} />
                        <span className={cn("transition-opacity", isCollapsed && !isMobile && "opacity-0 w-0", isMobile && "w-auto")}>{item.name}</span>
                        {!isCollapsed && !isMobile && <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />}
                      </Link>
                    </TooltipTrigger>
                    {!isMobile && isCollapsed && (
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ) : null
            )}
          </div>


        </div>
      </ScrollArea>
      
      {/* Section utilisateur */}
      <div className={cn("border-t p-4", isCollapsed && !isMobile && "p-2")}>
        <div className={cn("flex items-center gap-3", isCollapsed && !isMobile && "justify-center")}> 
          {/* User avatar/icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>

          {/* User details - masqué quand collapsed sur desktop */}
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 space-y-1 min-w-0"> 
              <p className="text-sm font-medium leading-none truncate">{user.email}</p>
              <div className="flex flex-wrap gap-1">
                {user.roles.map(role => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role === 'Employé' || role === 'EmployÃ©' ? 'Employé' : role}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de déconnexion */}
      <div className="border-t p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                  isCollapsed && !isMobile && "justify-center px-2"
                )}
              >
                <LogOut className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-3")} />
                {(!isCollapsed || isMobile) && <span>Déconnexion</span>}
              </Button>
            </TooltipTrigger>
            {!isMobile && isCollapsed && (
              <TooltipContent side="right">
                Déconnexion
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}

export { Sidebar };