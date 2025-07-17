'use client';

import * as React from 'react';
import {
  Heart,
  Home,
  Plus,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { ClientSidebarProvider } from './client-sidebar-provider';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/utils';
import type { User as FirebaseUser } from 'firebase/auth';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth() as { user: FirebaseUser | null };

  // Helper to handle protected navigation
  const handleProtectedNav = (href: string) => (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Get first letter of displayName or email
  const userInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <ClientSidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleProtectedNav('/')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary">
                  <rect width="256" height="256" fill="none"></rect>
                  <path d="M208,88H152a8,8,0,0,1-8-8V24a8,8,0,0,0-8-8H56A16,16,0,0,0,40,32V224a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V96A8,8,0,0,0,208,88Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
                  <polyline points="144 88 208 88 208 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline>
              </svg>
            <h1 className="text-xl font-semibold">TripWise</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full" onClick={handleProtectedNav('/')}>
                <SidebarMenuButton isActive={pathname === '/'}>
                  <Home className="mr-2" />
                  Home
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/favorites" className="w-full" onClick={handleProtectedNav('/favorites')}>
                <SidebarMenuButton isActive={pathname === '/favorites'}>
                  <Heart className="mr-2" />
                  Favorites
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search itineraries..."
                  defaultValue={searchParams.get('q') || ''}
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-4">
              <Link href="/create" onClick={handleProtectedNav('/create')}>
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                      <Plus className="mr-2 h-4 w-4" />
                      New Itinerary
                  </Button>
              </Link>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" />
                      <AvatarFallback>{user ? userInitial : '?'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuLabel>Welcome, {user.displayName || user.email}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                        Log out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel>Sign up or Log in to your account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login">
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/signup">
                          <Plus className="mr-2 h-4 w-4" />
                          Sign up
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </ClientSidebarProvider>
  );
}
