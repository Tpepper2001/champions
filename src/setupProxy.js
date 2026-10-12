const express = require('express');
const { Resend } = require('resend');

module.exports = function (app) {
  app.use(express.json());

  app.get('/api/resend-status', (req, res) => {
    const hasKey = !!process.env.RESEND_API_KEY;
    res.json({
      configured: hasKey,
      senderDomain: 'cleadglobal.org',
    });
  });

  app.post('/api/send-email', async (req, res) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        ok: false,
        configured: false,
        error:
          'RESEND_API_KEY is not configured in the server environment (.env). Please set RESEND_API_KEY in your environment.',
      });
    }

    try {
      const resend = new Resend(apiKey);
      const { from, fromName, to, subject, text, html } = req.body || {};
      const recipients = (Array.isArray(to) ? to : [to])
        .map((t) => String(t).trim())
        .filter(Boolean);

      if (recipients.length === 0) {
        return res.status(400).json({ ok: false, error: 'Recipient email is required.' });
      }

      const bodyText = String(text || '');
      const bodyHtml =
        html ||
        `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;">${bodyText}</div>`;

      const senderEmail = String(from || 'staff@cleadglobal.org').trim().toLowerCase();
      const displayName = String(fromName || 'Champions Leadership Global').replace(
        /[<>"]/g,
        ''
      );

      // Attempt sending with the corporate domain first
      let sendResult;
      try {
        sendResult = await resend.emails.send({
          from: `${displayName} <${senderEmail}>`,
          to: recipients,
          subject: String(subject || 'Message from Champions Leadership Global').trim(),
          text: bodyText,
          html: bodyHtml,
          replyTo: senderEmail,
        });
      } catch (errFirst) {
        sendResult = { error: errFirst };
      }

      // If domain verification error occurred in Resend, fallback to onboarding@resend.dev with replyTo
      if (
        sendResult?.error &&
        (sendResult.error.message?.toLowerCase().includes('domain') ||
          sendResult.error.statusCode === 403 ||
          sendResult.error.name === 'validation_error')
      ) {
        try {
          sendResult = await resend.emails.send({
            from: `${displayName} <onboarding@resend.dev>`,
            to: recipients,
            subject: String(subject || 'Message from Champions Leadership Global').trim(),
            text: bodyText,
            html: bodyHtml,
            replyTo: senderEmail,
          });
        } catch (errRetry) {
          sendResult = { error: errRetry };
        }
      }

      if (sendResult?.error) {
        return res.status(400).json({
          ok: false,
          error: sendResult.error.message || 'Resend dispatch failed',
          details: sendResult.error,
        });
      }

      return res.json({
        ok: true,
        id: sendResult?.data?.id,
        provider: 'resend',
      });
    } catch (err) {
      console.error('API /api/send-email error:', err);
      return res.status(500).json({
        ok: false,
        error: err.message || 'Internal server error while sending email',
      });
    }
  });
};
