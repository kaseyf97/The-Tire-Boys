export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, vehicleYear, vehicleMake, vehicleModel, service, preferredDate, preferredTime, issue } = req.body;

  try {
    // 1. Send full email to Gmail via Formspree
    await fetch('https://formspree.io/f/maqpvgaq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        vehicle: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        service,
        preferredDate,
        preferredTime,
        issue,
        _subject: `Appointment Request: ${name} — ${service}`
      })
    });

    // 2. Send push notification via ntfy
    await fetch('https://ntfy.sh/tireboys-alerts-2026', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Title': 'New Appointment - The Tire Boys',
        'Priority': 'high'
      },
      body: `${name} | ${phone} | ${vehicleYear} ${vehicleMake} ${vehicleModel} | ${service} | ${preferredDate} ${preferredTime}`
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
