import { ItineraryForm } from '@/components/itineraries/itinerary-form';
import { PlusCircle } from 'lucide-react';

export default function CreateItineraryPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <PlusCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Create a New Itinerary</h1>
        </div>
      <ItineraryForm />
    </div>
  );
}
