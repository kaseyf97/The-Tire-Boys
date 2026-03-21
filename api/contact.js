export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, reason, message, _gotcha } = req.body;

  // Honeypot: bots fill in hidden fields, real users don't
  if (_gotcha) {
    return res.status(200).json({ success: true });
  }

  // Validate required fields
  if (!name || !phone || !reason) {
    return res.status(400).json({ error: 'Name, phone, and reason are required.' });
  }

  // Validate field lengths
  if (name.length > 100 || phone.length > 20 || (message && message.length > 2000)) {
    return res.status(400).json({ error: 'One or more fields exceed maximum length.' });
  }

  // Strip HTML tags to prevent injection
  const clean = (str) => str ? str.replace(/<[^>]*>/g, '').trim() : '';
  const safeName    = clean(name);
  const safePhone   = clean(phone);
  const safeReason  = clean(reason);
  const safeMessage = clean(message);

  try {
    // 1. Send full email to Gmail via Formspree
    await fetch('https://formspree.io/f/maqpvgaq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: safeName, phone: safePhone, email, reason: safeReason, message: safeMessage })
    });

    // 2. Send push notification via ntfy
    await fetch('https://ntfy.sh/tireboys-alerts-2026', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Title': 'New Contact - The Tire Boys',
        'Priority': 'high'
      },
      body: `${safeName} | ${safePhone} | ${safeReason}\n${safeMessage || ''}`
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
