'use client';

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Activity } from '@/lib/types';

interface ItineraryMapProps {
  activities: Activity[];
}

export function ItineraryMap({ activities }: ItineraryMapProps) {
  if (activities.length === 0) {
    return <div className="flex items-center justify-center h-full bg-muted">No locations to show.</div>;
  }

  const center = activities.reduce(
    (acc, activity) => {
      acc.lat += activity.location.lat;
      acc.lng += activity.location.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );
  center.lat /= activities.length;
  center.lng /= activities.length;

  return (
    <Map
      defaultCenter={center}
      defaultZoom={10}
      mapId="ROAMFLOW_MAP"
      style={{ width: '100%', height: '100%' }}
    >
      {activities.map((activity, index) => (
        <AdvancedMarker key={index} position={activity.location}>
          <Pin>
            <span className="font-bold text-white">{index + 1}</span>
          </Pin>
        </AdvancedMarker>
      ))}
    </Map>
  );
}
