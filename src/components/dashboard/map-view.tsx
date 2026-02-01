'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Store, Building2 } from 'lucide-react';

const stores = [
  { lat: 12.972442, lng: 77.580643, name: 'National Seeds Corp' },
  { lat: 12.9780, lng: 77.5900, name: 'Kisan Agri Store' },
];

const mandis = [
  { lat: 12.9698, lng: 77.5978, name: 'KR Market (Mandi)' },
  { lat: 12.9959, lng: 77.6223, name: 'Russel Market (Mandi)' },
];

export default function MapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = { lat: 12.9716, lng: 77.5946 };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nearby Resources</CardTitle>
          <CardDescription>Seed stores and Mandi locations on the map.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Resources</CardTitle>
        <CardDescription>Seed stores and Mandi locations on the map.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
          <APIProvider apiKey={apiKey}>
            <Map
              center={position}
              zoom={12}
              mapId="farmeko_map"
              disableDefaultUI={true}
            >
              {stores.map((store, i) => (
                <AdvancedMarker key={`store-${i}`} position={store}>
                  <div className="p-2 bg-background rounded-full shadow-md">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                </AdvancedMarker>
              ))}
               {mandis.map((mandi, i) => (
                <AdvancedMarker key={`mandi-${i}`} position={mandi}>
                  <div className="p-2 bg-accent rounded-full shadow-md">
                    <Building2 className="h-5 w-5 text-accent-foreground" />
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" /> Seed Store
            </div>
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" /> Mandi
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
