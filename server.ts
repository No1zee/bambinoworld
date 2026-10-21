import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory persistent store for bookings during runtime (synced to client localStorage as well)
const bookingsStore: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  adultCount: number;
  childCount: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  wristbandCode: string;
}> = [];

// Booking API
app.post('/api/bookings', (req, res) => {
  const { name, email, phone, ticketType, adultCount, childCount, total, paymentMethod, notes } = req.body;
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

  bookingsStore.unshift(booking);
  res.json({ success: true, booking });
});

app.get('/api/bookings', (req, res) => {
  res.json({ bookings: bookingsStore });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bambino World server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
