import { Resend } from 'resend';

export default async function handler(req, res) {
  const rawKey = (
    process.env.RESEND_API_KEY ||
    process.env.REACT_APP_RESEND_API_KEY ||
    ''
  ).trim();

  const isConfigured = Boolean(rawKey && rawKey.length > 0);
  const maskedKey = isConfigured
    ? `${rawKey.slice(0, 5)}...${rawKey.slice(-4)}`
    : null;

  return res.status(200).json({
    configured: isConfigured,
    apiKeyMasked: maskedKey,
    senderDomain: 'cleadglobal.org',
    fallbackDomain: 'onboarding@resend.dev',
    environment: 'vercel',
    serverTime: new Date().toISOString(),
    recommendation: isConfigured
      ? 'Resend API key is detected in the server environment.'
      : 'RESEND_API_KEY is not defined in server environment variables. Please add RESEND_API_KEY in your Vercel Project Settings.',
  });
}
