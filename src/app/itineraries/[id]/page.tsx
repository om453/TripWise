'use client';

import { useEffect, useState } from 'react';
import { getItinerary } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { ItineraryView } from '@/components/itineraries/itinerary-view';
import { Itinerary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ItineraryPage() {
  const params = useParams();
  const { id } = params;
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      const fetchedItinerary = getItinerary(id);
      if (!fetchedItinerary) {
        notFound();
      } else {
        setItinerary(fetchedItinerary);
      }
      setIsLoading(false);
    }
  }, [id]);

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
