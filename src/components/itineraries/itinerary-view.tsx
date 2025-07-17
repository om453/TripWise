
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Tag, List, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { Itinerary } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSuggestions } from './ai-suggestions';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
    const activitiesText = itinerary.activities.map(a => a.name).join(', ');

  return (
    <div className="space-y-8">
      <header className="relative h-64 md:h-96 rounded-lg overflow-hidden -mt-8 -mx-8">
        <Link href="/">
            <Button variant="outline" size="icon" className="absolute top-4 left-4 z-10 bg-background/80 hover:bg-background/100">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
            </Button>
        </Link>
        <Image
          src={itinerary.photo}
          alt={itinerary.title}
          fill
          className="object-cover"
          data-ai-hint={itinerary.photoHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold">{itinerary.title}</h1>
          <p className="text-xl mt-2">{itinerary.destination}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{format(new Date(itinerary.startDate), 'MMM d, yyyy')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-semibold">{format(new Date(itinerary.endDate), 'MMM d, yyyy')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Tag className="h-8 w-8 text-primary" />
                    <div>
                        <p className="text-muted-foreground">Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.categories && itinerary.categories.length > 0 && itinerary.categories.map((cat) => (
                            <Badge key={cat} variant="outline" className="capitalize bg-orange-100 text-orange-800 border-orange-200">{cat}</Badge>
                          ))}
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>About this trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{itinerary.description}</p>
            </CardContent>
          </Card>
          <AiSuggestions location={itinerary.destination} activities={activitiesText} />
        </div>
      </div>
    </div>
  );
}
