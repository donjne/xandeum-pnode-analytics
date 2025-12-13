'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNetworkStore } from '@/stores/networkStore';
import { AlertCircle, CheckCircle2, Database, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function APIStatus() {
  const { 
    useMockData, 
    isLoading, 
    error, 
    lastUpdated, 
    totalCount,
    toggleMockData, 
    refreshNodes,
    clearError 
  } = useNetworkStore();

  const handleToggle = () => {
    toggleMockData(!useMockData);
  };

  const handleRefresh = () => {
    clearError();
    refreshNodes();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Source
        </CardTitle>
        <CardDescription>
          Toggle between mock data and real pRPC API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mock/Real toggle */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="mock-mode" className="flex flex-col space-y-1">
            <span>Mock Data Mode</span>
            <span className="text-xs text-muted-foreground font-normal">
              {useMockData 
                ? 'Using generated mock data (100 nodes)'
                : 'Using real pRPC API endpoints'}
            </span>
          </Label>
          <Switch
            id="mock-mode"
            checked={useMockData}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

        {/* Status indicator */}
        <div className="space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge 
              variant={error ? 'destructive' : useMockData ? 'secondary' : 'default'}
              className="gap-1"
            >
              {error ? (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Error
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  {useMockData ? 'Mock' : 'Live'}
                </>
              )}
            </Badge>
          </div>

          {/* Node count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nodes:</span>
            <span className="font-medium">{totalCount}</span>
          </div>

          {/* Last updated */}
          {lastUpdated > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">
                {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-destructive">Connection Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Refresh button */}
        <Button 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh Now'}
        </Button>

        {/* Info */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <strong>Mock Mode:</strong> Uses generated data for testing
          </p>
          <p>
            <strong>Live Mode:</strong> Connects to pRPC endpoints via /api/prpc
          </p>
          <p className="mt-2">
            Configure endpoints in <code className="rounded bg-muted px-1 py-0.5">.env.local</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}