import { ItineraryList } from '@/components/itineraries/itinerary-list';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div>
        <div className="flex items-center gap-4 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Favorite Itineraries</h1>
        </div>
        {/* Only show the list, no empty state message */}
        <ItineraryList showOnlyFavorites />
    </div>
  );
}
