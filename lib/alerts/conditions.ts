import type { PNode } from '@/lib/types/pnode';
import type { Alert } from '@/lib/types/alert';

export function isAlertTriggered(alert: Alert, nodes: PNode[]): boolean {
  switch (alert.condition) {
    case 'node_offline':
      return nodes.some(n => n.status === 'offline');

    case 'storage_threshold':
      if (alert.threshold == null) return false;
      return nodes.some(
        n => n.storage_usage_percent >= alert.threshold!
      );

    case 'performance_degraded':
      if (alert.threshold == null) return false;
      return nodes.some(
        n => n.health_score != null && n.health_score < alert.threshold!
      );

    default:
      return false;
  }
}
