import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import { isAlertTriggered } from './conditions';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function evaluateAlerts() {
  const client = await clientPromise;
  const db = client.db('alerts');

  const alerts = await db
    .collection('alert_definitions')
    .find({ enabled: true })
    .toArray();

  if (!alerts.length) return { triggered: 0 };

  const nodesRes = await fetch(`${process.env.APP_URL}/api/network/nodes`);
  const pods = await nodesRes.json();

  const subscribers = await db
    .collection('email_subscriptions')
    .find({})
    .toArray();

  let triggeredCount = 0;

  for (const alert of alerts) {
    // rate-limit: 10 minutes
    if (
      alert.lastTriggered &&
      Date.now() - alert.lastTriggered < 10 * 60 * 1000
    ) {
      continue;
    }

    const triggered = isAlertTriggered(alert as any, pods);

    if (!triggered) continue;

    triggeredCount++;

    for (const sub of subscribers) {
      await resend.emails.send({
        from: 'Xandeum Alerts <alerts@xandeum.io>',
        to: sub.email,
        subject: `${alert.name}`,
        html: `
          <h2>${alert.name}</h2>
          <p>Severity: <strong>${alert.severity}</strong></p>
          <p>Condition: ${alert.condition}</p>
          <p>Time: ${new Date().toUTCString()}</p>
        `,
      });
    }

    await db.collection('alert_definitions').updateOne(
      { _id: alert._id },
      { $set: { lastTriggered: Date.now() } }
    );
  }

  return { triggered: triggeredCount };
}
