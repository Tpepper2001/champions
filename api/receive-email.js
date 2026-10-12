const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { Resend } = require('resend');

// Vercel env vars needed:
//   RESEND_API_KEY, RESEND_WEBHOOK_SECRET (whsec_...),
//   FIREBASE_SERVICE_ACCOUNT (full service-account JSON as one string)
// Optional: FIRESTORE_DATABASE_ID (defaults to the named DB used by the web app)
const DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID ||
  'ai-studio-champions-b506e80d-724a-46be-956b-3fd850955e31';

// Lazy init so a bad env var returns a readable JSON error instead of crashing the function.
let cached = null;
function getClients() {
  if (cached) return cached;

  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const webhookSecret = (process.env.RESEND_WEBHOOK_SECRET || '').trim();
  const rawSa = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();

  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!webhookSecret) throw new Error('RESEND_WEBHOOK_SECRET is not set');
  if (!rawSa) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');

  let sa;
  try {
    sa = JSON.parse(rawSa);
  } catch (e) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON (paste the whole key file as one value)');
  }
  // Env vars often turn real newlines into the two characters \n
  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');

  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
  }

  cached = {
    resend: new Resend(apiKey),
    webhookSecret,
    // The app uses a NAMED Firestore database, so admin.firestore() (default DB) would miss it.
    db: getFirestore(admin.app(), DATABASE_ID),
  };
  return cached;
}

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

  let resend, webhookSecret, db;
  try {
    ({ resend, webhookSecret, db } = getClients());
  } catch (err) {
    console.error('receive-email config error:', err.message);
    return res.status(500).json({ ok: false, code: 'ERR_CONFIG', error: err.message });
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
        webhookSecret,
      });
    } catch (err) {
      console.error('Webhook signature failed:', err.message);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Webhook received:', event.type);

    if (event.type !== 'email.received') {
      return res.status(200).json({ ignored: event.type });
    }

    const meta = event.data; // metadata only: email_id, from, to[], subject, ...

    // The webhook has no body; fetch it from the Receiving API.
    const { data: email, error } = await resend.emails.receiving.get(meta.email_id);
    if (error) {
      console.error('Could not fetch received email:', error);
      return res.status(500).json({ error: 'Fetch failed' }); // Resend will retry
    }

    const recipients = (meta.to || []).map(bareAddress).filter(Boolean);
    const nowIso = new Date().toISOString();
    let saved = 0;

    for (const address of recipients) {
      // Match the mailbox by email, then fall back to the username part.
      let snap = await db
        .collection('mailboxes')
        .where('email', '==', address)
        .limit(1)
        .get();

      if (snap.empty) {
        snap = await db
          .collection('mailboxes')
          .where('username', '==', address.split('@')[0])
          .limit(1)
          .get();
      }

      // Never drop mail: with no mailbox it is stored as "general". The portal also
      // matches on the "to" address, so it still shows up for the right person.
      const mailboxId = snap.empty ? 'general' : snap.docs[0].id;
      if (snap.empty) console.warn('No mailbox for', address, '- stored as general');

      // Deterministic doc ID makes webhook retries idempotent.
      await db
        .collection('messages')
        .doc(`${meta.email_id}_${mailboxId}`)
        .set({
          mailboxId,
          recipientMailboxId: snap.empty ? null : mailboxId,
          recipientEmail: address,
          folder: 'inbox',
          from: bareAddress(meta.from),
          fromEmail: bareAddress(meta.from),
          fromName: meta.from,
          to: address,
          subject: meta.subject || '(no subject)',
          body: email.text || '',
          html: email.html || '',
          receivedAt: nowIso,
          createdAt: nowIso,
          date: nowIso,
          read: false,
          status: 'delivered',
        });
      saved += 1;
    }

    console.log('Saved', saved, 'message(s) for email', meta.email_id);
    return res.status(200).json({ ok: true, saved });
  } catch (err) {
    console.error('receive-email error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to process email', detail: err.message });
  }
};
