'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ItineraryCard } from './itinerary-card';
import type { Itinerary } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useItinerary } from '@/context/itinerary-context';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Plus, Compass } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function ItineraryList({ showOnlyFavorites = false }: { showOnlyFavorites?: boolean }) {
  const { itineraries, toggleFavorite, deleteItinerary, isLoading } = useItinerary();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    try {
      deleteItinerary(id);
      toast({
        title: "Itinerary Deleted",
        description: "The itinerary has been successfully removed.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete the itinerary.",
      });
    }
  };

  const filteredItineraries = React.useMemo(() => {
    let items = itineraries;

    if (showOnlyFavorites) {
      items = items.filter(it => it.isFavorite);
    }

    if (query) {
      return items.filter(
        it =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.destination.toLowerCase().includes(query.toLowerCase()) ||
          it.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    return items;
  }, [query, itineraries, showOnlyFavorites]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredItineraries.length === 0) {
    const handleCreateClick = (e: React.MouseEvent) => {
      if (!user) {
        e.preventDefault();
        router.push('/login');
      }
    };
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-250px)]">
        <Compass className="h-20 w-20 text-accent mb-6 animate-bounce" />
        <h2 className="text-4xl font-extrabold mb-4 text-accent drop-shadow-lg">Start Your Next Adventure!</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Your journey begins here. Create your first itinerary and let tripwise help you plan unforgettable experiences. Click below to get started!
        </p>
        <Link href="/create" onClick={handleCreateClick}>
          <Button className="bg-accent hover:bg-accent/90 text-lg px-8 py-4 rounded-full shadow-lg animate-pulse">
            <Plus className="mr-3 h-6 w-6" />
            Create Your First Itinerary
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {filteredItineraries.map(itinerary => (
          <motion.div
            key={itinerary.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ItineraryCard
              itinerary={itinerary}
              onFavoriteToggle={toggleFavorite}
              onDelete={handleDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
