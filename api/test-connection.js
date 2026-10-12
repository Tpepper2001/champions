import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const rawKey = (
    process.env.RESEND_API_KEY ||
    process.env.REACT_APP_RESEND_API_KEY ||
    ''
  ).trim();

  if (!rawKey) {
    return res.status(503).json({
      ok: false,
      code: 'ERR_MISSING_API_KEY',
      error: 'RESEND_API_KEY is not configured in Vercel environment variables.',
      troubleshooting: [
        'Add RESEND_API_KEY in your Vercel Dashboard -> Project Settings -> Environment Variables',
        'Ensure the key starts with re_ and is deployed to Production/Preview',
      ],
    });
  }

  try {
    const resend = new Resend(rawKey);
    const probe = await resend.apiKeys.list().catch((err) => ({ error: err }));

    if (probe && probe.error) {
      return res.status(401).json({
        ok: false,
        code: 'ERR_INVALID_API_KEY',
        error: probe.error.message || 'Invalid Resend API Key',
        troubleshooting: [
          'Verify that your RESEND_API_KEY matches the key in your Resend dashboard',
          'Ensure the key has full or sending permissions',
        ],
      });
    }

    return res.status(200).json({
      ok: true,
      code: 'RESEND_CONNECTED',
      message: 'Resend API connection is active and healthy on Vercel.',
      apiKeyMasked: `${rawKey.slice(0, 5)}...${rawKey.slice(-4)}`,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      code: 'ERR_PROBE_EXCEPTION',
      error: err.message,
    });
  }
}
