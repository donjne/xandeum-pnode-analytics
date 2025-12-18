'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Globe, MapPin, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

/* ---------------------------------------------
   Leaflet (client only)
--------------------------------------------- */
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

/* ---------------------------------------------
   Skeleton
--------------------------------------------- */
function MapSkeleton() {
  return (
    <div className="h-[380px] flex items-center justify-center rounded-xl bg-black/10 dark:bg-black/20">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
        <p className="text-sm text-slate-500 dark:text-white/60">
          Loading geographic preview…
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   NetworkMap
--------------------------------------------- */
export function NetworkMap() {
  const { nodes, onlineCount, totalCount } = useNetworkStore();

  const [locations, setLocations] = React.useState<
    {
      lat: number;
      lng: number;
      city: string;
      country: string;
    }[]
  >([]);

  /* -------------------------------------------
     Fetch SAMPLE locations via INTERNAL API
     - hard limit: 2 nodes
     - no CORS
     - no rate limit abuse
  ------------------------------------------- */
  React.useEffect(() => {
    let cancelled = false;

    async function fetchLocations() {
      const sampleNodes = nodes.slice(0, 2); // HARD LIMIT

      const results: typeof locations = [];

      for (const node of sampleNodes) {
        try {
          const ip = node.address.split(':')[0];

          const res = await fetch(`/api/geolocation?ip=${ip}`);
          if (!res.ok) continue;

          const data = await res.json();

          if (!data?.lat || !data?.lng) continue;

          results.push({
            lat: data.lat,
            lng: data.lng,
            city: data.city ?? 'Unknown',
            country: data.country ?? 'Unknown',
          });
        } catch {
          // silent fail
        }
      }

      if (!cancelled) setLocations(results);
    }

    if (nodes.length) fetchLocations();

    return () => {
      cancelled = true;
    };
  }, [nodes]);

  /* -------------------------------------------
     Map center
  ------------------------------------------- */
  const center: [number, number] =
    locations.length > 0
      ? [
          locations.reduce((s, l) => s + l.lat, 0) / locations.length,
          locations.reduce((s, l) => s + l.lng, 0) / locations.length,
        ]
      : [20, 0];

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border border-transparent',
        // light mode
        'bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]',
        // dark mode separation (NO white border)
        'dark:bg-[#0A0E27]/80 dark:backdrop-blur-xl',
        'dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
      )}
    >
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            Geographic Distribution
          </CardTitle>

          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-300">
            <MapPin className="h-3 w-3 mr-1" />
            {onlineCount}/{totalCount} Online
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="relative overflow-hidden rounded-xl">
          {locations.length === 0 ? (
            <MapSkeleton />
          ) : (
            <MapContainer
              center={center}
              zoom={locations.length === 1 ? 4 : 2}
              className="h-[380px] w-full"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {locations.map((loc, i) => (
                <CircleMarker
                  key={i}
                  center={[loc.lat, loc.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor: '#10b981',
                    fillOpacity: 0.9,
                    color: '#ffffff',
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">
                        {loc.city}, {loc.country}
                      </div>
                      <div className="text-xs text-slate-500">
                        Showing node location
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
