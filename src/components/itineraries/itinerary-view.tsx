
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Tag, List, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { Itinerary } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ItineraryMap } from './itinerary-map';
import { AiSuggestions } from './ai-suggestions';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
    const categoryStyles = {
        adventure: 'bg-orange-100 text-orange-800 border-orange-200',
        leisure: 'bg-blue-100 text-blue-800 border-blue-200',
        work: 'bg-gray-100 text-gray-800 border-gray-200',
    };

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
                        <p className="text-muted-foreground">Category</p>
                        <Badge variant="outline" className={cn("capitalize font-semibold", categoryStyles[itinerary.category])}>{itinerary.category}</Badge>
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
          
          <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'><List /> Planned Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                    {itinerary.activities.map((activity) => (
                        <li key={activity.day} className="flex gap-4">
                           <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                                    {activity.day}
                                </div>
                                <div className="h-full w-px bg-border"></div>
                           </div>
                           <div className="pt-2">
                               <p className="font-semibold">{activity.name}</p>
                           </div>
                        </li>
                    ))}
                </ul>
              </CardContent>
          </Card>

          <AiSuggestions location={itinerary.destination} activities={activitiesText} />

        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin /> Itinerary Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full rounded-lg overflow-hidden">
                <ItineraryMap activities={itinerary.activities} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
