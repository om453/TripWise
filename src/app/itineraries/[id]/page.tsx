'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ItineraryView } from '@/components/itineraries/itinerary-view';
import { Itinerary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/utils';

export default function ItineraryPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user || typeof id !== 'string') return;
    setIsLoading(true);
    const fetchItinerary = async () => {
      const ref = doc(firestore, 'itineraries', user.uid, 'items', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setIsLoading(false);
        router.replace('/');
        return;
      }
      setItinerary({ id: snap.id, ...(snap.data() as Omit<Itinerary, 'id'>) });
      setIsLoading(false);
    };
    fetchItinerary();
  }, [user, id, router]);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="relative h-64 md:h-96 rounded-lg -mt-8 -mx-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!itinerary) {
    return null; 
  }

  return <ItineraryView itinerary={itinerary} />;
}
