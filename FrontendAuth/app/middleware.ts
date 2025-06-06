import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenir le token depuis les cookies (plus sécurisé que localStorage pour SSR)
  const token = request.cookies.get('auth_token')?.value;
  
  const { pathname } = request.nextUrl;
  
  // Pages publiques (pas besoin d'authentification)
  const publicPaths = ['/login', '/'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Pages protégées
  const protectedPaths = ['/home', '/users', '/settings'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Si c'est une page protégée et qu'il n'y a pas de token
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si l'utilisateur est connecté et essaie d'accéder à la page de login
  if (token && pathname === '/login') {
    const homeUrl = new URL('/home', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // Rediriger la racine vers /home si connecté, vers /login sinon
  if (pathname === '/') {
    if (token) {
      const homeUrl = new URL('/home', request.url);
      return NextResponse.redirect(homeUrl);
    } else {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configurer les chemins qui doivent être protégés par le middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};