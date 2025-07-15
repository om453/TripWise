export interface Itinerary extends ItineraryData {
  id: string;
  activities: Activity[];
  isFavorite: boolean;
  photoHint: string;
}

export interface ItineraryData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  category: 'adventure' | 'leisure' | 'work';
  photo: string;
  description: string;
}

export interface Activity {
  day: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}
