'use client';

import * as React from 'react';
import { Radio, CheckCircle2, AlertCircle, TrendingUp, HardDrive, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNetworkStore } from '@/stores/networkStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  id: string;
  type: 'node_online' | 'node_offline' | 'storage_update' | 'version_update';
  message: string;
  timestamp: number;
  pubkey?: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export function LiveActivityFeed() {
  const { nodes, isLoading } = useNetworkStore();
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);
  const prevNodesRef = React.useRef<typeof nodes>([]);

  // Generate real activity events by comparing node states
  React.useEffect(() => {
    if (isLoading || nodes.length === 0) return;

    const prevNodes = prevNodesRef.current;
    const newActivities: ActivityEvent[] = [];

    // First load - show initial state
    if (prevNodes.length === 0 && nodes.length > 0) {
      const onlineNodes = nodes.filter(n => n.status === 'online');
      newActivities.push({
        id: `init-${Date.now()}`,
        type: 'node_online',
        message: `Network initialized with ${onlineNodes.length} online nodes`,
        timestamp: Date.now(),
        severity: 'success',
      });
    } else {
      // Detect changes
      nodes.forEach(node => {
        const prevNode = prevNodes.find(n => n.pubkey === node.pubkey);
        
        if (!prevNode) {
          // New node discovered
          newActivities.push({
            id: `new-${node.pubkey}-${Date.now()}`,
            type: 'node_online',
            message: `New node discovered`,
            timestamp: Date.now(),
            pubkey: node.pubkey,
            severity: 'success',
          });
        } else {
          // Status change
          if (prevNode.status !== node.status) {
            newActivities.push({
              id: `status-${node.pubkey}-${Date.now()}`,
              type: node.status === 'online' ? 'node_online' : 'node_offline',
              message: `Node went ${node.status}`,
              timestamp: Date.now(),
              pubkey: node.pubkey,
              severity: node.status === 'online' ? 'success' : 'warning',
            });
          }
          
          // Storage change (significant)
          const storageDiff = Math.abs(node.storage_usage_percent - prevNode.storage_usage_percent);
          if (storageDiff > 5) {
            newActivities.push({
              id: `storage-${node.pubkey}-${Date.now()}`,
              type: 'storage_update',
              message: `Storage usage ${node.storage_usage_percent > prevNode.storage_usage_percent ? 'increased' : 'decreased'} to ${node.storage_usage_percent.toFixed(1)}%`,
              timestamp: Date.now(),
              pubkey: node.pubkey,
              severity: node.storage_usage_percent > 85 ? 'warning' : 'info',
            });
          }
          
          // Version update
          if (prevNode.version !== node.version) {
            newActivities.push({
              id: `version-${node.pubkey}-${Date.now()}`,
              type: 'version_update',
              message: `Updated to v${node.version}`,
              timestamp: Date.now(),
              pubkey: node.pubkey,
              severity: 'info',
            });
          }
        }
      });

      // Detect removed nodes
      prevNodes.forEach(prevNode => {
        const exists = nodes.find(n => n.pubkey === prevNode.pubkey);
        if (!exists) {
          newActivities.push({
            id: `removed-${prevNode.pubkey}-${Date.now()}`,
            type: 'node_offline',
            message: `Node left the network`,
            timestamp: Date.now(),
            pubkey: prevNode.pubkey,
            severity: 'error',
          });
        }
      });
    }

    if (newActivities.length > 0) {
      setActivities(prev => [...newActivities, ...prev].slice(0, 50)); // Keep last 50
    }

    prevNodesRef.current = nodes;
  }, [nodes, isLoading]);

  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'node_online':
        return CheckCircle2;
      case 'node_offline':
        return AlertCircle;
      case 'storage_update':
        return HardDrive;
      case 'version_update':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getSeverityConfig = (severity: ActivityEvent['severity']) => {
    switch (severity) {
      case 'success':
        return {
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/30',
        };
      case 'warning':
        return {
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
        };
      case 'error':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
        };
      default:
        return {
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
        };
    }
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <CardHeader>
          <CardTitle>Live Activity Feed</CardTitle>
          <CardDescription>Loading network events...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 animate-pulse bg-white/5 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
      {/* Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-400" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time network events</CardDescription>
          </div>
          <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30 animate-pulse" />
            <p>Waiting for network activity...</p>
            <p className="text-xs mt-2">Events will appear as nodes join or change status</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const config = getSeverityConfig(activity.severity);
                
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border p-3 transition-all duration-300",
                      "backdrop-blur-sm hover:scale-[1.02]",
                      config.bgColor,
                      config.borderColor
                    )}
                  >
                    {/* Hover shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]" />
                    
                    <div className="relative flex items-start gap-3">
                      <div className={cn(
                        "rounded-full p-2 mt-0.5",
                        config.bgColor
                      )}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white/90">
                            {activity.message}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          {activity.pubkey && (
                            <>
                              <span className="font-mono truncate max-w-[150px]">
                                {activity.pubkey.slice(0, 8)}...{activity.pubkey.slice(-4)}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>

                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-xs",
                          config.bgColor,
                          config.borderColor,
                          config.color
                        )}
                      >
                        {activity.severity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
