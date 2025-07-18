import type { Itinerary, ItineraryData } from './types';
import { firestore } from './utils';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';

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
    activities: data.activities || [],
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

export async function addItineraryToFirestore(userId: string, data: ItineraryData) {
  const ref = collection(firestore, 'itineraries', userId, 'items');
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Date.now(),
    isFavorite: false,
    activities: data.activities || [],
    photoHint: data.destination.split(',')[0].toLowerCase(),
  });
  return docRef.id;
}

export async function getUserItinerariesFromFirestore(userId: string): Promise<Itinerary[]> {
  const ref = collection(firestore, 'itineraries', userId, 'items');
  const q = query(ref);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data() as Omit<Itinerary, 'id'>;
    return {
      id: docSnap.id,
      ...data,
    };
  });
}

export async function deleteItineraryFromFirestore(userId: string, itineraryId: string) {
  const ref = doc(firestore, 'itineraries', userId, 'items', itineraryId);
  await deleteDoc(ref);
}

export async function updateItineraryInFirestore(userId: string, itineraryId: string, data: Partial<Record<string, any>>) {
  const ref = doc(firestore, 'itineraries', userId, 'items', itineraryId);
  await updateDoc(ref, data);
}
