'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Globe, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

// leaflet (client-only)
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

type GeoLocation = {
  lat: number;
  lng: number;
  country: string;
  city: string;
};

export function NetworkMap() {
  const { nodes, onlineCount, totalCount } = useNetworkStore();
  const [locations, setLocations] = React.useState<
    Map<string, GeoLocation>
  >(new Map());

  // fetch only once
  React.useEffect(() => {
    if (!nodes.length || locations.size > 0) return;

    const fetchGeo = async () => {
      const onlineNodes = nodes.filter((n) => n.status === 'online').slice(0, 2);

      for (const node of onlineNodes) {
        const ip = node.address.split(':')[0];

        try {
          const res = await fetch(`/api/geo?ip=${ip}`);
          const data = await res.json();

          if (data?.lat && data?.lng) {
            setLocations((prev) =>
              new Map(prev).set(node.pubkey, data)
            );
          }
        } catch {
          // silent fail — map still renders
        }
      }
    };

    fetchGeo();
  }, [nodes, locations.size]);

  const nodesWithLocations = nodes.filter((n) =>
    locations.has(n.pubkey)
  );

  const center: [number, number] =
    nodesWithLocations.length > 0
      ? [
          locations.get(nodesWithLocations[0].pubkey)!.lat,
          locations.get(nodesWithLocations[0].pubkey)!.lng,
        ]
      : [20, 0];

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        // glass surface — no border in dark mode
        'bg-[#0A0E27]/80 backdrop-blur-xl',
        'shadow-xl shadow-black/30',
        'transition-all duration-300'
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Sample node locations across the network
            </CardDescription>
          </div>

          <Badge className="bg-blue-500/20 text-blue-300">
            <MapPin className="h-3 w-3 mr-1" />
            {onlineCount}/{totalCount} Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-xl shadow-inner">
          <MapContainer
            center={center}
            zoom={nodesWithLocations.length ? 3 : 2}
            style={{ height: 400, width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {nodesWithLocations.map((node) => {
              const loc = locations.get(node.pubkey);
              if (!loc) return null;

              return (
                <CircleMarker
                  key={node.pubkey}
                  center={[loc.lat, loc.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor: '#10b981',
                    fillOpacity: 0.85,
                    color: '#ffffff',
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold">
                        {node.pubkey.slice(0, 8)}…
                      </div>
                      <div className="text-xs text-gray-500">
                        {loc.city}, {loc.country}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {locations.size < 2 && (
          <div className="mt-3 text-xs text-white/50 text-center">
            Showing locations
          </div>
        )}
      </CardContent>
    </Card>
  );
}
