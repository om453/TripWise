'use client';

import * as React from 'react';
import type { Itinerary, ItineraryData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  addItineraryToFirestore,
  getUserItinerariesFromFirestore,
  deleteItineraryFromFirestore,
  updateItineraryInFirestore,
} from '@/lib/data';

interface ItineraryContextType {
  itineraries: Itinerary[];
  toggleFavorite: (id: string) => void;
  addItinerary: (itinerary: ItineraryData) => Promise<void>;
  deleteItinerary: (id: string) => void;
  isLoading: boolean;
}

const ItineraryContext = React.createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user, loading: authLoading } = useAuth();

  // Fetch itineraries from Firestore when user logs in
  React.useEffect(() => {
    if (!user) {
      setItineraries([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getUserItinerariesFromFirestore(user.uid)
      .then((data) => setItineraries(data))
      .finally(() => setIsLoading(false));
  }, [user]);

  const addItinerary = async (data: ItineraryData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const id = await addItineraryToFirestore(user.uid, data);
      const newItinerary: Itinerary = {
        id,
        ...data,
        isFavorite: false,
        activities: data.activities || [],
        photoHint: data.destination.split(',')[0].toLowerCase(),
      };
      setItineraries((prev) => [newItinerary, ...prev]);
    } catch (error) {
      console.error('Failed to add itinerary to Firestore:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItinerary = async (id: string) => {
    if (!user) return;
    setIsLoading(true);
    await deleteItineraryFromFirestore(user.uid, id);
    setItineraries((prev) => prev.filter((it) => it.id !== id));
    setIsLoading(false);
  };

  const toggleFavorite = async (id: string) => {
    if (!user) return;
    const itinerary = itineraries.find((it) => it.id === id);
    if (!itinerary) return;
    const updated = { ...itinerary, isFavorite: !itinerary.isFavorite };
    setItineraries((prev) => prev.map((it) => (it.id === id ? updated : it)));
    await updateItineraryInFirestore(user.uid, id, { isFavorite: updated.isFavorite as any });
  };

  return (
    <ItineraryContext.Provider value={{ itineraries, toggleFavorite, addItinerary, deleteItinerary, isLoading }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = React.useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
