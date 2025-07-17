export interface Itinerary extends ItineraryData {
  category: any;
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
  categories: string[];
  photo: string;
  description: string;
  activities?: Activity[];
}

export interface Activity {
  day: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}
