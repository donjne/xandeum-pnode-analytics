/**
 * IP Geolocation Service
 * 
 * Converts IP addresses to geographic coordinates using ip-api.com
 * Free tier: 45 requests/minute, no API key required
 * For production: Consider upgrading to ipgeolocation.io or ipapi.co
 */

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

interface GeoCache {
  [ip: string]: {
    data: GeoLocation;
    timestamp: number;
  };
}

class IPGeolocationService {
  private cache: GeoCache = {};
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly API_URL = 'http://ip-api.com/json';
  private requestQueue: Promise<any>[] = [];
  private readonly MAX_CONCURRENT = 5;

  /**
   * Get geolocation for a single IP address
   */
  async getLocation(ip: string): Promise<GeoLocation | null> {
    // Check cache first
    const cached = this.cache[ip];
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Wait for queue to have space
      while (this.requestQueue.length >= this.MAX_CONCURRENT) {
        await Promise.race(this.requestQueue);
      }

      const request = this.fetchLocation(ip);
      this.requestQueue.push(request);
      
      const data = await request;
      
      // Remove from queue
      this.requestQueue = this.requestQueue.filter(r => r !== request);
      
      if (data.status === 'success') {
        const location: GeoLocation = {
          ip: data.query,
          country: data.country,
          countryCode: data.countryCode,
          region: data.region,
          regionName: data.regionName,
          city: data.city,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as,
        };

        // Cache the result
        this.cache[ip] = {
          data: location,
          timestamp: Date.now(),
        };

        return location;
      }

      return null;
    } catch (error) {
      console.error(`Failed to get location for IP ${ip}:`, error);
      return null;
    }
  }

  /**
   * Fetch location from API
   */
  private async fetchLocation(ip: string): Promise<any> {
    const response = await fetch(`${this.API_URL}/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    return response.json();
  }

  /**
   * Batch get locations for multiple IPs
   */
  async getBatchLocations(ips: string[]): Promise<Map<string, GeoLocation>> {
    const results = new Map<string, GeoLocation>();
    
    // Process in batches to avoid rate limiting
    const batchSize = 15; // Stay well under 45/min limit
    for (let i = 0; i < ips.length; i += batchSize) {
      const batch = ips.slice(i, i + batchSize);
      const promises = batch.map(ip => this.getLocation(ip));
      const batchResults = await Promise.all(promises);
      
      batchResults.forEach((result, index) => {
        if (result) {
          results.set(batch[index], result);
        }
      });

      // Rate limiting delay between batches
      if (i + batchSize < ips.length) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s between batches
      }
    }

    return results;
  }

  /**
   * Extract IP from pNode address (format: "IP:PORT")
   */
  extractIP(address: string): string {
    return address.split(':')[0];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: Object.keys(this.cache).length,
      entries: Object.keys(this.cache),
    };
  }
}

// Export singleton instance
export const geoLocationService = new IPGeolocationService();