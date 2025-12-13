import * as React from 'react';
import { Mail, Webhook, MessageCircle, Send, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  type: 'email' | 'webhook' | 'discord' | 'telegram';
  name: string;
  config: Record<string, string>;
  verified: boolean;
  enabled: boolean;
}

const channelIcons = {
  email: Mail,
  webhook: Webhook,
  discord: MessageCircle,
  telegram: Send,
};

export function NotificationChannels() {
  const { toast } = useToast();
  const [channels, setChannels] = React.useState<Channel[]>([
    {
      id: '1',
      type: 'email',
      name: 'Primary Email',
      config: { address: 'user@example.com' },
      verified: true,
      enabled: true,
    },
    {
      id: '2',
      type: 'discord',
      name: 'Team Discord',
      config: { webhookUrl: 'https://discord.com/api/webhooks/...' },
      verified: true,
      enabled: false,
    },
  ]);

  const [editingChannel, setEditingChannel] = React.useState<string | null>(null);

  const handleTest = (channelId: string) => {
    toast({
      title: 'Test notification sent',
      description: 'Check your notification channel for the test message',
    });
  };

  const handleToggle = (channelId: string) => {
    setChannels(
      channels.map((ch) =>
        ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
      )
    );
    toast({
      title: 'Channel updated',
      description: 'Notification channel has been updated',
    });
  };

  const handleVerify = (channelId: string) => {
    setChannels(
      channels.map((ch) =>
        ch.id === channelId ? { ...ch, verified: true } : ch
      )
    );
    toast({
      title: 'Channel verified',
      description: 'Notification channel has been verified successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notification Channels</h2>
        <p className="text-muted-foreground">
          Configure where you receive alert notifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.type];
          return (
            <Card key={channel.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {channel.verified ? (
                      <Badge variant="success">
                        <Check className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        <X className="mr-1 h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                    <Badge variant={channel.enabled ? 'default' : 'secondary'}>
                      {channel.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="capitalize">{channel.type} notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Channel config display */}
                <div className="space-y-2">
                  {channel.type === 'email' && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Email Address</Label>
                      <p className="text-sm">{channel.config.address}</p>
                    </div>
                  )}
                  {(channel.type === 'webhook' || channel.type === 'discord') && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Webhook URL</Label>
                      <p className="truncate text-sm font-mono">
                        {channel.config.webhookUrl?.slice(0, 40)}...
                      </p>
                    </div>
                  )}
                  {channel.type === 'telegram' && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Chat ID</Label>
                      <p className="text-sm font-mono">{channel.config.chatId}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  {!channel.verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(channel.id)}
                    >
                      Verify
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleTest(channel.id)}>
                    Test
                  </Button>
                  <Button
                    variant={channel.enabled ? 'secondary' : 'default'}
                    size="sm"
                    onClick={() => handleToggle(channel.id)}
                  >
                    {channel.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add new channel */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Channel</CardTitle>
          <CardDescription>Configure a new notification channel</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Add Channel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}