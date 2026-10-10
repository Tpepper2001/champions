export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle the email data received from Resend
  const emailData = req.body;
  console.log('Received email:', emailData);
  
  // TODO: Save the received email to Firestore using firebase-admin.
  // Note: This requires proper service account configuration.
  
  return res.status(200).json({ status: 'success' });
}
