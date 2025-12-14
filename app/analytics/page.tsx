'use client';

import { Metadata } from 'next';
import { 
  NetworkGrowthChart,
  VersionDistribution,
  StorageAnalysis,
  CreditDistribution,
  HeartbeatHealth 
} from '@/components/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Analytics | Xandeum pNode Analytics',
  description: 'Comprehensive network analytics and insights',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Network Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive insights and metrics for the Xandeum pNode network
        </p>
      </div>

      {/* Tabbed Analytics Views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <NetworkGrowthChart />
          <div className="grid gap-6 lg:grid-cols-2">
            <VersionDistribution />
            <HeartbeatHealth />
          </div>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <StorageAnalysis />
          <div className="grid gap-6 lg:grid-cols-2">
            <NetworkGrowthChart />
            <VersionDistribution />
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <HeartbeatHealth />
          <CreditDistribution />
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <CreditDistribution />
          <div className="grid gap-6 lg:grid-cols-2">
            <NetworkGrowthChart />
            <HeartbeatHealth />
          </div>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <HeartbeatHealth />
          <div className="grid gap-6 lg:grid-cols-2">
            <StorageAnalysis />
            <VersionDistribution />
          </div>
        </TabsContent>
      </Tabs>

      {/* All Analytics - Full View (Outside Tabs) */}
      <div className="space-y-6 border-t pt-6">
        <h2 className="text-2xl font-bold">Complete Analytics</h2>
        
        <NetworkGrowthChart />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <VersionDistribution />
          <StorageAnalysis />
        </div>
        
        <CreditDistribution />
        
        <HeartbeatHealth />
      </div>
    </div>
  );
}