// Rate limiting: max 5 submissions per IP per 15 minutes
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, first: now };
  if (now - entry.first > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, first: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, first: entry.first });
  return false;
}

export default async function handler(req, res) {
  // Check rate limit
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait 15 minutes before trying again.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, vehicleYear, vehicleMake, vehicleModel, service, preferredDate, preferredTime, issue, _gotcha } = req.body;

  // Honeypot: bots fill in hidden fields, real users don't
  if (_gotcha) {
    return res.status(200).json({ success: true });
  }

  // Validate required fields
  if (!name || !phone || !vehicleYear || !vehicleMake || !vehicleModel || !service) {
    return res.status(400).json({ error: 'Name, phone, vehicle info, and service are required.' });
  }

  // Validate field lengths
  if (
    name.length > 100 ||
    phone.length > 20 ||
    vehicleMake.length > 50 ||
    vehicleModel.length > 50 ||
    (issue && issue.length > 2000)
  ) {
    return res.status(400).json({ error: 'One or more fields exceed maximum length.' });
  }

  // Validate date format if provided
  if (preferredDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(preferredDate)) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }
    const parsedDate = new Date(preferredDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date.' });
    }
  }

  // Strip HTML tags to prevent injection
  const clean = (str) => str ? str.replace(/<[^>]*>/g, '').trim() : '';
  const safeName    = clean(name);
  const safePhone   = clean(phone);
  const safeMake    = clean(vehicleMake);
  const safeModel   = clean(vehicleModel);
  const safeService = clean(service);
  const safeIssue   = clean(issue);

  try {
    // 1. Send full email to Gmail via Formspree
    await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: safeName,
        phone: safePhone,
        email,
        vehicle: `${vehicleYear} ${safeMake} ${safeModel}`,
        service: safeService,
        preferredDate,
        preferredTime,
        issue: safeIssue,
        _subject: `Appointment Request: ${safeName} — ${safeService}`
      })
    });

    // 2. Send push notification via ntfy
    await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Title': 'New Appointment - The Tire Boys',
        'Priority': 'high',
        'Authorization': `Bearer ${process.env.NTFY_TOKEN}`
      },
      body: `${safeName} | ${safePhone} | ${vehicleYear} ${safeMake} ${safeModel} | ${safeService} | ${preferredDate} ${preferredTime}`
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
