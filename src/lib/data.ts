import type { Itinerary, ItineraryData } from './types';

// This file will now act as a utility for creating/deleting itineraries in-memory
// before they are persisted to localStorage by the context.
// The functions are no longer async as localStorage is synchronous.

export function getItineraries(): Itinerary[] {
  if (typeof window !== 'undefined') {
    const storedItineraries = localStorage.getItem('itineraries');
    return storedItineraries ? JSON.parse(storedItineraries) : [];
  }
  return [];
}

export function getItinerary(id: string): Itinerary | undefined {
  const itineraries = getItineraries();
  const found = itineraries.find(it => it.id === id);
  return found ? { ...found } : undefined;
}

export function createItinerary(data: ItineraryData): Itinerary {
  const newItinerary: Itinerary = {
    id: Date.now().toString(),
    ...data,
    isFavorite: false,
    activities: [],
    photoHint: data.destination.split(',')[0].toLowerCase(),
  };
  // The context will handle adding this to its state and localStorage
  return newItinerary;
}

export function deleteItineraryApi(id: string): void {
    // This function doesn't need to do anything with a local array anymore.
    // The context handles removing the item from state, which then updates localStorage.
    // The function is kept for structural consistency.
}
