import admin from 'firebase-admin';
import { verifyWebhookSignature } from 'resend';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['svix-signature'];
    const payload = JSON.stringify(req.body);

    const isVerified = verifyWebhookSignature(
      payload,
      signature,
      process.env.RESEND_WEBHOOK_SECRET
    );

    if (!isVerified) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Handle the email data received from Resend
    const { from, to, subject, html, text } = req.body;
    
    // Save to Firestore
    await db.collection('emails').add({
      from,
      to,
      subject,
      html,
      text,
      receivedAt: new Date().toISOString()
    });

    return res.status(200).json({ message: 'Email saved successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save email' });
  }
}
