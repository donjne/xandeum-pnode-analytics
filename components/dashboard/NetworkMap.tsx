'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Globe, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapSkeleton /> }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

function MapSkeleton() {
  return (
    <div className="h-[400px] bg-gradient-to-br from-blue-950/50 to-purple-950/50 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
        <p className="text-sm text-white/60">Loading map...</p>
      </div>
    </div>
  );
}

export function NetworkMap() {
  const { nodes, isLoading, onlineCount, totalCount } = useNetworkStore();
  const [geoLocations, setGeoLocations] = React.useState<Map<string, { lat: number; lng: number; country: string; city: string }>>(new Map());
  const [isClient, setIsClient] = React.useState(false);

  // Detect client-side rendering
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch geolocation for nodes
  React.useEffect(() => {
    if (nodes.length === 0) return;

    const fetchLocations = async () => {
      const newLocations = new Map(geoLocations);
      
      for (const node of nodes) {
        if (geoLocations.has(node.pubkey)) continue;

        try {
          // Extract IP from address (format: "IP:PORT")
          const ip = node.address.split(':')[0];
          
          // Use ip-api.com for free geolocation
          const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon`);
          const data = await response.json();
          
          if (data.status === 'success') {
            newLocations.set(node.pubkey, {
              lat: data.lat,
              lng: data.lon,
              country: data.country,
              city: data.city,
            });
          }
        } catch (error) {
          console.error(`Failed to fetch location for ${node.pubkey}:`, error);
        }
      }
      
      if (newLocations.size > geoLocations.size) {
        setGeoLocations(newLocations);
      }
    };

    fetchLocations();
  }, [nodes, geoLocations]);

  // Calculate map center from node locations
  const mapCenter: [number, number] = React.useMemo(() => {
    if (geoLocations.size === 0) {
      return [20, 0]; // Default world view
    }

    const locations = Array.from(geoLocations.values());
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return [avgLat, avgLng];
  }, [geoLocations]);

  // Prepare nodes with locations
  const nodesWithLocations = React.useMemo(() => {
    return nodes
      .map(node => ({
        ...node,
        location: geoLocations.get(node.pubkey),
      }))
      .filter(node => node.location); // Only nodes with known locations
  }, [nodes, geoLocations]);

  if (!isClient) {
    return <MapSkeleton />;
  }

  return (
    <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none z-10" />
      
      <CardHeader className="relative z-20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              {nodesWithLocations.length > 0 
                ? `${nodesWithLocations.length} nodes mapped across the globe`
                : 'Loading node locations...'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <MapPin className="h-3 w-3 mr-1" />
            {onlineCount}/{totalCount} Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-20">
        <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          {nodesWithLocations.length === 0 ? (
            // Placeholder when no locations yet
            <div className="h-[400px] bg-gradient-to-br from-blue-950/50 to-purple-950/50 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Globe className="h-16 w-16 text-blue-400/50 mx-auto animate-pulse" />
                <div>
                  <p className="text-white/80 font-medium">Discovering Node Locations</p>
                  <p className="text-sm text-white/50 mt-1">
                    {nodes.length > 0 
                      ? `Geo-locating ${nodes.length} nodes...`
                      : 'Waiting for network data...'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={geoLocations.size === 1 ? 4 : 2}
              style={{ height: '400px', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {nodesWithLocations.map((node) => {
                if (!node.location) return null;
                
                const isOnline = node.status === 'online';
                
                return (
                  <CircleMarker
                    key={node.pubkey}
                    center={[node.location.lat, node.location.lng]}
                    radius={8}
                    pathOptions={{
                      fillColor: isOnline ? '#10b981' : '#6b7280',
                      fillOpacity: 0.8,
                      color: '#fff',
                      weight: 2,
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.setStyle({
                          fillOpacity: 1,
                          weight: 3,
                        });
                      },
                      mouseout: (e) => {
                        e.target.setStyle({
                          fillOpacity: 0.8,
                          weight: 2,
                        });
                      },
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="space-y-2 p-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-3 w-3 rounded-full animate-pulse",
                            isOnline ? "bg-emerald-400" : "bg-gray-400"
                          )} />
                          <span className="font-semibold text-sm">
                            {node.pubkey.slice(0, 8)}...{node.pubkey.slice(-4)}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium">{node.location.city}, {node.location.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className={cn(
                              "font-medium",
                              isOnline ? "text-emerald-600" : "text-gray-600"
                            )}>
                              {node.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Version:</span>
                            <span className="font-medium">v{node.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Storage:</span>
                            <span className="font-medium">{node.storage_usage_percent.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Uptime:</span>
                            <span className="font-medium">{(node.uptime / 3600).toFixed(0)}h</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Online ({nodesWithLocations.filter(n => n.status === 'online').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
            <span>Offline ({nodesWithLocations.filter(n => n.status === 'offline').length})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}