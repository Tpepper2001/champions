import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '', 'base64').toString('utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    console.log('Email received and saved successfully.');
    return res.status(200).json({ message: 'Email saved successfully' });
  } catch (error) {
    console.error('Error saving email:', error);
    return res.status(500).json({ error: 'Failed to save email' });
  }
}
