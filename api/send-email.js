import { Resend } from 'resend';

const DOMAIN = 'cleadglobal.org';

const escapeHtml = (t) =>
  String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export default async function handler(req, res) {
  // CORS & Method Check
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
      error:
        'RESEND_API_KEY is not configured in Vercel environment variables. Please add RESEND_API_KEY in your Vercel Project Settings.',
      troubleshooting: [
        'Open your Vercel Dashboard -> Project -> Settings -> Environment Variables',
        'Add RESEND_API_KEY with your key (re_...)',
        'Redeploy the project to activate the variable',
      ],
    });
  }

  try {
    const { from, fromName, to, subject, text, html } = req.body || {};
    const recipients = (Array.isArray(to) ? to : [to])
      .map((t) => String(t || '').trim())
      .filter(Boolean);

    if (recipients.length === 0) {
      return res.status(400).json({
        ok: false,
        code: 'ERR_NO_RECIPIENTS',
        error: 'Recipient email is required.',
      });
    }

    const senderEmail = String(from || 'staff@cleadglobal.org').trim().toLowerCase();
    const displayName = String(fromName || 'Champions Leadership Global').replace(/[<>"]/g, '');
    const subjectClean = String(subject || 'Message from Champions Leadership Global').trim();
    const bodyText = String(text || '');
    const bodyHtml =
      html ||
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(bodyText)}</div>`;

    const resend = new Resend(rawKey);

    // Attempt 1: Send via official domain
    let usedSender = `${displayName} <${senderEmail}>`;
    let sendResult;

    try {
      sendResult = await resend.emails.send({
        from: usedSender,
        to: recipients,
        subject: subjectClean,
        text: bodyText,
        html: bodyHtml,
        replyTo: senderEmail,
      });
    } catch (errFirst) {
      sendResult = { error: errFirst };
    }

    // Attempt 2: If domain is unverified on Resend, fallback to onboarding@resend.dev
    if (
      sendResult?.error &&
      (String(sendResult.error.message || '').toLowerCase().includes('domain') ||
        sendResult.error.statusCode === 403 ||
        sendResult.error.name === 'validation_error' ||
        sendResult.error.name === 'missing_required_field')
    ) {
      try {
        usedSender = `${displayName} <onboarding@resend.dev>`;
        sendResult = await resend.emails.send({
          from: usedSender,
          to: recipients,
          subject: subjectClean,
          text: bodyText,
          html: bodyHtml,
          replyTo: senderEmail,
        });
      } catch (errRetry) {
        sendResult = { error: errRetry };
      }
    }

    // Handle failure
    if (sendResult?.error) {
      const errorMsg = sendResult.error.message || 'Resend rejected email dispatch';
      const isFreeTierLimitation =
        errorMsg.toLowerCase().includes('own email') ||
        errorMsg.toLowerCase().includes('only send testing emails');

      const troubleshootingTips = [];
      if (isFreeTierLimitation) {
        troubleshootingTips.push(
          'Resend free sandbox (onboarding@resend.dev) only allows sending to the email registered on your Resend account.'
        );
        troubleshootingTips.push(
          'To send emails to external recipients like Gmail, verify cleadglobal.org at resend.com/domains.'
        );
      } else {
        troubleshootingTips.push(
          'Please verify cleadglobal.org DNS records in your Resend Dashboard at resend.com/domains.'
        );
      }

      return res.status(400).json({
        ok: false,
        code: sendResult.error.name || 'ERR_RESEND_REJECTED',
        error: errorMsg,
        details: sendResult.error,
        troubleshooting: troubleshootingTips,
      });
    }

    return res.status(200).json({
      ok: true,
      id: sendResult?.data?.id,
      provider: 'resend',
      senderUsed: usedSender,
      recipients,
    });
  } catch (err) {
    console.error('send-email error on Vercel:', err);
    return res.status(500).json({
      ok: false,
      code: 'ERR_SERVER_EXCEPTION',
      error: err.message || 'Internal server error while transmitting email',
    });
  }
}
