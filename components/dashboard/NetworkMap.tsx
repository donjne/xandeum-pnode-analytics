'use client';

import * as React from 'react';
import { Globe, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNetworkStore } from '@/stores/networkStore';
import { Skeleton } from '@/components/ui/skeleton';
import { geoLocationService, GeoLocation } from '@/lib/services/geolocation';
import { PNode } from '@/lib/types/pnode';

// Leaflet types
import type { LatLngExpression } from 'leaflet';

interface PNodeLocation extends PNode {
  location: GeoLocation;
}

interface RegionStats {
  region: string;
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
  coordinates: { lat: number; lng: number };
}

// Separate component for the map to handle client-side rendering
function LeafletMap({ nodes }: { nodes: PNodeLocation[] }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    
    // Load Leaflet CSS
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        document.head.appendChild(link);
      }
    }
  }, []);

  // Don't render until mounted (client-side only)
  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Import Leaflet components dynamically
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  
  // Fix marker icons
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    });
  }

  const center: LatLngExpression = [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {nodes.map((node) => {
        const position: LatLngExpression = [node.location.lat, node.location.lon];
        return (
          <Marker key={node.pubkey} position={position}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{node.location.city}, {node.location.country}</p>
                <p className="text-sm text-muted-foreground">{node.address}</p>
                <p className="text-xs">Version: {node.version}</p>
                <p className="text-xs">ISP: {node.location.isp}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export function NetworkMap() {
  const { nodes, isLoading: loading } = useNetworkStore();
  const [geoData, setGeoData] = React.useState<Map<string, GeoLocation>>(new Map());
  const [isLoadingGeo, setIsLoadingGeo] = React.useState(false);

  // Load geolocation data for all nodes
  React.useEffect(() => {
    if (nodes.length === 0) return;

    const loadGeoData = async () => {
      setIsLoadingGeo(true);
      try {
        // Extract unique IPs from node addresses
        const ips = [...new Set(nodes.map(node => geoLocationService.extractIP(node.address)))];
        
        // Fetch geolocation data
        const locations = await geoLocationService.getBatchLocations(ips);
        setGeoData(locations);
      } catch (error) {
        console.error('Failed to load geolocation data:', error);
      } finally {
        setIsLoadingGeo(false);
      }
    };

    loadGeoData();
  }, [nodes]);

  // Calculate region distribution
  const regionStats = React.useMemo((): RegionStats[] => {
    if (geoData.size === 0) return [];

    const regionMap = new Map<string, { count: number; location: GeoLocation }>();
    
    nodes.forEach((node: PNode) => {
      const ip = geoLocationService.extractIP(node.address);
      const location = geoData.get(ip);
      
      if (location) {
        const key = `${location.city}, ${location.country}`;
        const existing = regionMap.get(key);
        
        if (existing) {
          existing.count++;
        } else {
          regionMap.set(key, { count: 1, location });
        }
      }
    });

    const total = nodes.length || 1;
    return Array.from(regionMap.entries())
      .map(([region, data]) => ({
        region,
        country: data.location.country,
        countryCode: data.location.countryCode,
        count: data.count,
        percentage: (data.count / total) * 100,
        coordinates: { lat: data.location.lat, lng: data.location.lon },
      }))
      .sort((a, b) => b.count - a.count);
  }, [nodes, geoData]);

  // Get nodes with locations for map markers
  const nodesWithLocations = React.useMemo((): PNodeLocation[] => {
    return nodes
      .map((node: PNode) => {
        const ip = geoLocationService.extractIP(node.address);
        const location = geoData.get(ip);
        return location ? { ...node, location } : null;
      })
      .filter((node): node is PNodeLocation => node !== null);
  }, [nodes, geoData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <CardDescription>Loading network map...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Distribution
        </CardTitle>
        <CardDescription>
          {isLoadingGeo ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading geolocation data...
            </span>
          ) : (
            `${nodesWithLocations.length} pNodes mapped across ${regionStats.length} locations`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interactive Map */}
        <div className="h-[400px] w-full rounded-lg overflow-hidden border">
          {nodesWithLocations.length > 0 ? (
            <LeafletMap nodes={nodesWithLocations} />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              {isLoadingGeo ? (
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading map data...</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No location data available</p>
              )}
            </div>
          )}
        </div>

        {/* Region List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Top Locations
          </h4>
          <div className="space-y-2">
            {regionStats.slice(0, 10).map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between py-2 px-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {region.countryCode}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{region.region}</p>
                    <p className="text-xs text-muted-foreground">{region.count} nodes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{region.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
          
          {regionStats.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{regionStats.length - 10} more locations
            </p>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{regionStats.length}</p>
            <p className="text-xs text-muted-foreground">Locations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {new Set(regionStats.map(r => r.countryCode)).size}
            </p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nodesWithLocations.length}</p>
            <p className="text-xs text-muted-foreground">Mapped Nodes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}