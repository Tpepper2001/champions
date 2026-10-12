const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { Resend } = require('resend');

// Vercel env vars needed:
//   RESEND_API_KEY, RESEND_WEBHOOK_SECRET (whsec_...),
//   FIREBASE_SERVICE_ACCOUNT (full service-account JSON as one string)
// Optional: FIRESTORE_DATABASE_ID (defaults to the named DB in firebase-applet-config.json)
const DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID ||
  'ai-studio-champions-b506e80d-724a-46be-956b-3fd850955e31';

const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
const RESEND_WEBHOOK_SECRET = (process.env.RESEND_WEBHOOK_SECRET || '').trim();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

// The app uses a NAMED Firestore database, so admin.firestore() (default DB) would miss it.
const db = getFirestore(admin.app(), DATABASE_ID);

const resend = new Resend(RESEND_API_KEY);

// Signature verification needs the exact raw body, so read the stream ourselves.
async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const bareAddress = (s) => {
  const m = String(s || '').match(/<([^>]+)>/);
  return (m ? m[1] : String(s || '')).trim().toLowerCase();
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await readRawBody(req);

    let event;
    try {
      event = resend.webhooks.verify({
        payload,
        headers: {
          id: req.headers['svix-id'],
          timestamp: req.headers['svix-timestamp'],
          signature: req.headers['svix-signature'],
        },
        webhookSecret: RESEND_WEBHOOK_SECRET,
      });
    } catch (err) {
      console.error('Webhook signature failed:', err.message);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    if (event.type !== 'email.received') {
      return res.status(200).json({ ignored: event.type });
    }

    const meta = event.data; // metadata only: email_id, from, to[], subject, ...

    // The webhook has no body; fetch it from the Receiving API.
    const { data: email, error } = await resend.emails.receiving.get(
      meta.email_id
    );
    if (error) {
      console.error('Could not fetch received email:', error);
      return res.status(500).json({ error: 'Fetch failed' }); // Resend will retry
    }

    const recipients = (meta.to || []).map(bareAddress);

    for (const address of recipients) {
      const snap = await db
        .collection('mailboxes')
        .where('email', '==', address)
        .limit(1)
        .get();

      if (snap.empty) {
        console.warn('No mailbox for', address);
        continue;
      }

      const mailboxId = snap.docs[0].id;

      // Deterministic doc ID makes webhook retries idempotent.
      await db
        .collection('messages')
        .doc(`${meta.email_id}_${mailboxId}`)
        .set({
          mailboxId,
          folder: 'inbox',
          from: bareAddress(meta.from),
          fromName: meta.from,
          to: address,
          subject: meta.subject || '(no subject)',
          body: email.text || '',
          html: email.html || '',
          receivedAt: new Date().toISOString(),
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          read: false,
        });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('receive-email error:', err);
    return res.status(500).json({ error: 'Failed to process email' });
  }
};