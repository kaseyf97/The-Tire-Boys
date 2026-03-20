export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, reason, message } = req.body;

  try {
    // 1. Send email via Formspree
    await fetch('https://formspree.io/f/maqpvgaq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, phone, email, reason, message })
    });

    // 2. Send SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone  = process.env.TWILIO_PHONE_NUMBER;
    const toPhone    = process.env.TO_PHONE_NUMBER;

    const smsText = [
      `📬 New Contact - The Tire Boys`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      `Reason: ${reason}`,
      `Message: ${message || 'None'}`
    ].join('\n');

    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ From: fromPhone, To: toPhone, Body: smsText })
      }
    );

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
