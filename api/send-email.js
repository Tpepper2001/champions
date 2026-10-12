import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';


const DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID ||
  'ai-studio-champions-b506e80d-724a-46be-956b-3fd850955e31';

const DOMAIN = 'cleadglobal.org';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

const db = getFirestore(admin.app(), DATABASE_ID);
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const escapeHtml = (t) =>
  String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Authenticate the caller
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = await admin
      .auth()
      .verifyIdToken(authHeader.split('Bearer ')[1]);

    // 2. Validate input
    const { from, fromName, to, subject, text } = req.body || {};
    const sender = String(from || '').trim().toLowerCase();
    const recipients = (Array.isArray(to) ? to : [to])
      .map((x) => String(x || '').trim())
      .filter(Boolean);

    if (!sender.endsWith(`@${DOMAIN}`)) {
      return res.status(400).json({ error: `Sender must be an @${DOMAIN} address` });
    }
    if (recipients.length === 0 || recipients.length > 20) {
      return res.status(400).json({ error: 'Provide 1 to 20 recipients' });
    }
    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    // 3. The sender mailbox must exist, and the caller must own it or be an admin
    const mbSnap = await db
      .collection('mailboxes')
      .where('email', '==', sender)
      .limit(1)
      .get();
    if (mbSnap.empty) {
      return res.status(403).json({ error: 'Unknown sender mailbox' });
    }
    const mailboxId = mbSnap.docs[0].id;

    const ownsMailbox =
      (decoded.email || '').toLowerCase() === sender || decoded.uid === mailboxId;
    const isAdmin = (await db.collection('admins').doc(decoded.uid).get()).exists;
    if (!ownsMailbox && !isAdmin) {
      return res.status(403).json({ error: 'You cannot send from this mailbox' });
    }

    // 4. Send through Resend (v6 returns { data, error } rather than throwing)
    const displayFrom = fromName ? `${String(fromName).replace(/[<>"]/g, '')} <${sender}>` : sender;
    const body = String(text || '');
    const { data, error } = await resend.emails.send({
      from: displayFrom,
      to: recipients,
      subject: String(subject).trim(),
      text: body,
      html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(body)}</div>`,
      replyTo: sender,
    });
    if (error) {
      console.error('Resend send error:', error);
      return res.status(502).json({ error: error.message || 'Resend rejected the message' });
    }

    // 5. Record in the Sent folder (admin SDK bypasses the client write rules)
    const now = new Date();
    await db.collection('messages').add({
      mailboxId,
      folder: 'sent',
      from: sender,
      fromName: fromName || '',
      to: recipients.join(', '),
      subject: String(subject).trim(),
      body,
      resendId: data?.id || null,
      receivedAt: now.toISOString(),
      date: now.toISOString().slice(0, 16).replace('T', ' '),
      read: true,
    });

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('send-email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
