'use client';

import * as React from 'react';
import type { Itinerary, ItineraryData } from '@/lib/types';
import { createItinerary, deleteItineraryApi } from '@/lib/data';

interface ItineraryContextType {
  itineraries: Itinerary[];
  toggleFavorite: (id: string) => void;
  addItinerary: (itinerary: ItineraryData) => void;
  deleteItinerary: (id: string) => void;
  isLoading: boolean;
}

const ItineraryContext = React.createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = React.useState(true); 

  React.useEffect(() => {
    try {
      const storedItineraries = localStorage.getItem('itineraries');
      if (storedItineraries) {
        setItineraries(JSON.parse(storedItineraries));
      }
    } catch (error) {
        console.error("Failed to load itineraries from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if(!isLoading) {
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
    }
  }, [itineraries, isLoading]);

  const toggleFavorite = (id: string) => {
    setItineraries(prev =>
      prev.map(it =>
        it.id === id ? { ...it, isFavorite: !it.isFavorite } : it
      )
    );
  };
  
  const addItinerary = (data: ItineraryData) => {
    const newItinerary = createItinerary(data);
    setItineraries(prev => [newItinerary, ...prev]);
  };

  const deleteItinerary = (id: string) => {
    deleteItineraryApi(id); // This function is now synchronous but keeping the name
    setItineraries(prev => prev.filter(it => it.id !== id));
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
