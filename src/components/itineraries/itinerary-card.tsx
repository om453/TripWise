'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Itinerary } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onFavoriteToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItineraryCard({ itinerary, onFavoriteToggle, onDelete }: ItineraryCardProps) {
  const { id, title, destination, startDate, endDate, photo, photoHint, category, isFavorite } = itinerary;
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const categoryStyles = {
    adventure: 'bg-orange-100 text-orange-800 border-orange-200',
    leisure: 'bg-blue-100 text-blue-800 border-blue-200',
    work: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete(id);
    setIsDialogOpen(false);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/itineraries/${id}`} className="block">
          <div className="aspect-video relative">
            <Image
              src={photo}
              alt={title}
              fill
              className="object-cover"
              data-ai-hint={photoHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={cn("capitalize", categoryStyles[category])}>{category}</Badge>
        </div>
        <Link href={`/itineraries/${id}`} className="group">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{title}</CardTitle>
        </Link>
        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{destination}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end items-center gap-1">
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.preventDefault(); setIsDialogOpen(true); }}
              >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  itinerary.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFavoriteToggle(id)}
            className="text-muted-foreground hover:text-red-500"
          >
            <Heart className={cn('h-5 w-5', isFavorite ? 'text-red-500 fill-current' : '')} />
            <span className="sr-only">Favorite</span>
          </Button>
      </CardFooter>
    </Card>
  );
}