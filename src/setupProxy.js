const express = require('express');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Ensure .env is read if present
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }
} catch (e) {
  console.warn('Could not load .env file in setupProxy:', e.message);
}

// In-memory server log buffer (last 100 entries)
const serverLogs = [];
function logEvent(level, category, message, details = null) {
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    level, // 'info' | 'warn' | 'error' | 'success'
    category,
    message,
    details: details ? JSON.parse(JSON.stringify(details)) : null,
  };
  serverLogs.unshift(entry);
  if (serverLogs.length > 100) serverLogs.pop();
  return entry;
}

module.exports = function (app) {
  app.use(express.json());

  // System status and configuration check
  app.get('/api/resend-status', (req, res) => {
    const rawKey = process.env.RESEND_API_KEY || process.env.REACT_APP_RESEND_API_KEY || '';
    const isConfigured = Boolean(rawKey && rawKey.trim().length > 0);
    const maskedKey = isConfigured
      ? `${rawKey.slice(0, 5)}...${rawKey.slice(-4)}`
      : null;

    res.json({
      configured: isConfigured,
      apiKeyMasked: maskedKey,
      senderDomain: 'cleadglobal.org',
      fallbackDomain: 'onboarding@resend.dev',
      serverTime: new Date().toISOString(),
      logsCount: serverLogs.length,
      recommendation: isConfigured
        ? 'Resend API key is detected in the server environment.'
        : 'RESEND_API_KEY is not defined in server environment (.env). Provide your key in .env or server environment to enable live external internet email dispatch.',
    });
  });

  // Fetch recent server-side dispatch & error logs
  app.get('/api/delivery-logs', (req, res) => {
    res.json({
      ok: true,
      count: serverLogs.length,
      logs: serverLogs,
    });
  });

  // Diagnostic connection test endpoint
  app.post('/api/test-connection', async (req, res) => {
    const rawKey = (process.env.RESEND_API_KEY || process.env.REACT_APP_RESEND_API_KEY || '').trim();

    if (!rawKey) {
      const errEntry = logEvent(
        'error',
        'Diagnostics',
        'Diagnostic check failed: RESEND_API_KEY is missing.',
        {
          code: 'ERR_MISSING_API_KEY',
          resolution: 'Add RESEND_API_KEY=re_your_api_key in the .env file and restart dev server.',
        }
      );

      return res.status(503).json({
        ok: false,
        code: 'ERR_MISSING_API_KEY',
        error: 'RESEND_API_KEY is not configured in server environment (.env).',
        troubleshooting: [
          'Create or update your .env file with RESEND_API_KEY=re_your_key_here',
          'Ensure your key begins with re_ and is valid on resend.com',
          'On free accounts, verify cleadglobal.org at resend.com/domains or test with your registered Resend email',
        ],
        log: errEntry,
      });
    }

    try {
      const resend = new Resend(rawKey);
      // Validate by querying API keys list
      const probeResult = await resend.apiKeys.list().catch((err) => ({ error: err }));
      
      if (probeResult && probeResult.error) {
        const errEntry = logEvent(
          'error',
          'Diagnostics',
          `Resend API rejected connection probe: ${probeResult.error.message || 'Invalid key'}`,
          { error: probeResult.error }
        );

        return res.status(401).json({
          ok: false,
          code: 'ERR_INVALID_API_KEY',
          error: probeResult.error.message || 'Invalid Resend API Key',
          troubleshooting: [
            'Check that your RESEND_API_KEY matches the key in your Resend account dashboard',
            'Ensure the key has "Sending access" or full permissions',
          ],
          log: errEntry,
        });
      }

      const successEntry = logEvent(
        'success',
        'Diagnostics',
        'Resend API connection verified successfully.',
        { rawKeyPreview: `${rawKey.slice(0, 5)}...${rawKey.slice(-4)}` }
      );

      return res.json({
        ok: true,
        code: 'RESEND_CONNECTED',
        message: 'Resend API connection is active and healthy.',
        log: successEntry,
      });
    } catch (probeErr) {
      const errEntry = logEvent(
        'error',
        'Diagnostics',
        `Diagnostic test exception: ${probeErr.message}`,
        { error: probeErr.message }
      );

      return res.status(500).json({
        ok: false,
        code: 'ERR_PROBE_EXCEPTION',
        error: probeErr.message,
        log: errEntry,
      });
    }
  });

  // Main email dispatch handler
  app.post('/api/send-email', async (req, res) => {
    const rawKey = (process.env.RESEND_API_KEY || process.env.REACT_APP_RESEND_API_KEY || '').trim();

    const { from, fromName, to, subject, text, html } = req.body || {};
    const recipients = (Array.isArray(to) ? to : [to])
      .map((t) => String(t).trim())
      .filter(Boolean);

    const senderEmail = String(from || 'staff@cleadglobal.org').trim().toLowerCase();
    const displayName = String(fromName || 'Champions Leadership Global').replace(/[<>"]/g, '');
    const subjectClean = String(subject || 'Message from Champions Leadership Global').trim();
    const bodyText = String(text || '');
    const bodyHtml =
      html ||
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">${bodyText}</div>`;

    // 1. Validate recipients
    if (recipients.length === 0) {
      const errEntry = logEvent('error', 'Validation', 'Dispatch aborted: No recipient specified.', {
        from: senderEmail,
        subject: subjectClean,
      });

      return res.status(400).json({
        ok: false,
        code: 'ERR_NO_RECIPIENTS',
        error: 'Recipient email address is required.',
        log: errEntry,
      });
    }

    // 2. Check API key configuration
    if (!rawKey) {
      const errEntry = logEvent(
        'error',
        'Resend Dispatch',
        `Internet dispatch failed for ${recipients.join(', ')}: RESEND_API_KEY is not configured in .env`,
        {
          code: 'ERR_MISSING_API_KEY',
          sender: senderEmail,
          recipients,
          subject: subjectClean,
          timestamp: new Date().toISOString(),
        }
      );

      return res.status(503).json({
        ok: false,
        configured: false,
        code: 'ERR_MISSING_API_KEY',
        error:
          'RESEND_API_KEY is not configured in the server environment (.env). External internet email cannot be dispatched through Resend without an API key.',
        details: {
          sender: senderEmail,
          recipients,
          subject: subjectClean,
        },
        troubleshooting: [
          'Add RESEND_API_KEY=re_your_api_key into the .env file in the project root.',
          'Obtain a free API key at https://resend.com/api-keys.',
          'Restart the application to reload the environment variable.',
          'Note: The message has still been securely archived in your Champions Leadership Global internal cloud database.',
        ],
        log: errEntry,
      });
    }

    try {
      const resend = new Resend(rawKey);

      logEvent('info', 'Resend Dispatch', `Attempting dispatch to ${recipients.join(', ')} via cleadglobal.org`, {
        from: `${displayName} <${senderEmail}>`,
        to: recipients,
        subject: subjectClean,
      });

      // Attempt 1: Using organization domain
      let sendResult;
      let usedSender = `${displayName} <${senderEmail}>`;

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

      // Attempt 2: If domain is not verified on Resend, fallback to onboarding@resend.dev
      if (
        sendResult?.error &&
        (String(sendResult.error.message || '').toLowerCase().includes('domain') ||
          sendResult.error.statusCode === 403 ||
          sendResult.error.name === 'validation_error' ||
          sendResult.error.name === 'missing_required_field')
      ) {
        logEvent(
          'warn',
          'Domain Fallback',
          `Sender domain cleadglobal.org not verified in Resend. Retrying via onboarding@resend.dev...`,
          { initialError: sendResult.error }
        );

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

      // Handle Resend rejection
      if (sendResult?.error) {
        const errorMsg = sendResult.error.message || 'Resend rejected email dispatch';
        const isDomainErr = errorMsg.toLowerCase().includes('domain');
        const isFreeTierLimitation =
          errorMsg.toLowerCase().includes('own email') ||
          errorMsg.toLowerCase().includes('only send testing emails');

        const errEntry = logEvent(
          'error',
          'Resend API Rejected',
          `Resend dispatch rejected: ${errorMsg}`,
          {
            error: sendResult.error,
            attemptedSender: usedSender,
            recipients,
            statusCode: sendResult.error.statusCode || 400,
          }
        );

        const troubleshootingTips = [];
        if (isFreeTierLimitation) {
          troubleshootingTips.push(
            'Resend free sandbox (onboarding@resend.dev) only allows sending to the email registered on your Resend account.'
          );
          troubleshootingTips.push(
            'To send emails to external recipients like Gmail, verify your domain (cleadglobal.org) at resend.com/domains.'
          );
        } else if (isDomainErr) {
          troubleshootingTips.push(
            'Please verify cleadglobal.org DNS records (DKIM, SPF) in your Resend Dashboard at resend.com/domains.'
          );
        } else {
          troubleshootingTips.push('Verify your Resend account balance, limits, and recipient validity.');
        }

        return res.status(400).json({
          ok: false,
          code: sendResult.error.name || 'ERR_RESEND_REJECTED',
          error: errorMsg,
          details: sendResult.error,
          attemptedSender: usedSender,
          recipients,
          troubleshooting: troubleshootingTips,
          log: errEntry,
        });
      }

      // Success
      const successEntry = logEvent(
        'success',
        'Resend API Dispatch',
        `Successfully dispatched to ${recipients.join(', ')} via Resend (ID: ${sendResult?.data?.id})`,
        {
          resendId: sendResult?.data?.id,
          usedSender,
          recipients,
          subject: subjectClean,
        }
      );

      return res.json({
        ok: true,
        id: sendResult?.data?.id,
        provider: 'resend',
        senderUsed: usedSender,
        recipients,
        log: successEntry,
      });
    } catch (err) {
      console.error('API /api/send-email error:', err);
      const errEntry = logEvent(
        'error',
        'Server Exception',
        `Internal server error in send-email proxy: ${err.message}`,
        { error: err.stack || err.message }
      );

      return res.status(500).json({
        ok: false,
        code: 'ERR_SERVER_EXCEPTION',
        error: err.message || 'Internal server error while transmitting email',
        troubleshooting: ['Check server terminal logs for detailed stack trace.'],
        log: errEntry,
      });
    }
  });
};

