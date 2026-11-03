export default function handler(req, res) {
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, email, phone, ticketType, adultCount, childCount, total, paymentMethod, notes } = body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const booking = {
      id: `BW-${Date.now().toString(36).toUpperCase()}`,
      name,
      email,
      phone: phone || '',
      ticketType: ticketType || 'early-bird',
      adultCount: Number(adultCount) || 1,
      childCount: Number(childCount) || 1,
      total: Number(total) || 25,
      paymentMethod: paymentMethod || 'ecocash',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      wristbandCode: `WB-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    return res.status(200).json({ success: true, booking });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ bookings: [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
