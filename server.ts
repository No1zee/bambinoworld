import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

// Guide setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `You are Bambino, the cheerful and helpful official guide for "Bambino World at The Little Farm" (Harare, Zimbabwe).
Event Details:
- Date: Saturday, 5 December 2026, 10:00 AM - 5:00 PM CAT (UTC+2)
- Venue: The Little Farm, Meyrick Park, 5 Richwell Ave, Mabelreign, Harare, Zimbabwe
- Slogan: "Where Little Dreams Come Alive"
- Ticket Prices: Early Bird $25, Standard $30, Gate $35 per child. Children 2 and under are FREE with a paying sibling. Sibling packages: 2 children $45, 3 children $60, 4 children $70.
- All tickets include: Lunch, juice, unlimited candyfloss, unlimited waffles, popcorn pack, face painting, live entertainment, inflatables, creative workshops, STEM discovery lab, Bambino Explorer Passport.

Key Play Zones & Facilities:
1. "little-garden" (The Little Garden): Baby Garden (6M–2Y). Fenced, shaded soft play, foam mats, ball pool, storytelling tent, parent seating, stroller parking bay.
2. "adventure-zone" (Adventure Zone): 3–6 years. 5 giant bouncy castles, inflatables, animal encounters, hoop shooting, giant Tic-Tac-Toe, family picnic tables.
3. "creative-zone" (Creative Zone): 3–6+ years. Roller-skating pit, helmet rentals, arts & crafts, painting, bracelet making.
4. "discovery-world" (Discovery World): STEM science lab (volcano eruptions, color mixing, rocket builds, plant pots, giant lawn chess, Jenga).
5. "celebration-stage" (Celebration Stage): Amphitheater stage for live music, clown shows, dance competitions, bubble shows, and family awards.
6. "fish-pond" (Fish Pond): Beautiful natural farm pond strictly fenced with wire mesh and supervised by safety marshals.
7. "swimming-pool" (Swimming Pool Buffer): Securely locked and fenced off with wrought iron. Not an activity; marked with a red-and-white safety buffer.
8. "parents-lounge" (Parents' Meeting & Lounge): Shaded pergolas along the south promenade, device charging, complimentary water, stroller rest.
9. "main-entrance" (Main Entrance & Registration): Welcome truss archway, fast-track check-in, wristbands.
10. "food-drinks" (Food & Drinks): Shaded refreshment marquees, artisan waffles, kid meals, cold juices.
11. "vehicular-exit" (Vehicular Exit Only): Controlled one-way boom gate egress route.
12. "staff-parking" (Staff Court): Reserved staging; no public activities.

Instructions:
- Be ultra-concise: reply in 1 complete, informative sentence. No conversational filler or text walls.
- When referencing a zone or age group, name it clearly so the 3D camera can fly the visitor directly to it.
- State facts directly (e.g. ticket inclusions, safety buffer, age ranges).`;

// AI Concierge Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Zone detection keyword mapping
  const zoneKeywords: Record<string, string> = {
    'baby': 'little-garden',
    'garden': 'little-garden',
    'toddler': 'little-garden',
    'infant': 'little-garden',
    'stroller': 'parents-lounge',
    'lounge': 'parents-lounge',
    'relax': 'parents-lounge',
    'bouncy': 'adventure-zone',
    'castle': 'adventure-zone',
    'adventure': 'adventure-zone',
    'jump': 'adventure-zone',
    'skate': 'creative-zone',
    'skating': 'creative-zone',
    'creative': 'creative-zone',
    'art': 'creative-zone',
    'craft': 'creative-zone',
    'science': 'discovery-world',
    'stem': 'discovery-world',
    'chess': 'discovery-world',
    'discovery': 'discovery-world',
    'stage': 'celebration-stage',
    'music': 'celebration-stage',
    'show': 'celebration-stage',
    'concert': 'celebration-stage',
    'performance': 'celebration-stage',
    'pond': 'fish-pond',
    'fish': 'fish-pond',
    'pool': 'swimming-pool',
    'swim': 'swimming-pool',
    'water': 'swimming-pool',
    'entrance': 'main-entrance',
    'gate': 'main-entrance',
    'register': 'main-entrance',
    'food': 'food-drinks',
    'drink': 'food-drinks',
    'waffle': 'food-drinks',
    'snack': 'food-drinks',
    'exit': 'vehicular-exit',
    'car': 'vehicular-exit',
  };

  let detectedZone: string | null = null;
  const lowerMsg = message.toLowerCase();
  for (const [kw, zId] of Object.entries(zoneKeywords)) {
    if (lowerMsg.includes(kw)) {
      detectedZone = zId;
      break;
    }
  }

  if (!ai || !apiKey) {
    // Graceful fallback if Gemini API key is not yet set
    const fallbackAnswers: Record<string, string> = {
      'little-garden': "The Little Garden offers shaded soft-play mats, foam obstacle blocks, and quiet storytelling for babies aged 6M–2Y.",
      'adventure-zone': "Adventure Zone features 4 giant bouncy castles, obstacle slides, and farm animal petting for kids aged 3–6.",
      'creative-zone': "Creative Zone includes an enclosed roller-skating pit with complimentary helmets, plus painting and craft tables.",
      'discovery-world': "Discovery World features volcano chemistry experiments, rocket builds, and a giant 6x6m outdoor lawn chessboard.",
      'celebration-stage': "Celebration Stage hosts live Zimbabwean marimba music, comedy clown shows, and giant floating soap bubble spectacles.",
      'swimming-pool': "The farm swimming pool is securely locked behind spear-picket security fencing with a certified lifeguard on perimeter duty.",
      'food-drinks': "All tickets include lunch, a juice box, unlimited freshly spun candyfloss, and warm artisan waffles."
    };

    const reply = detectedZone && fallbackAnswers[detectedZone]
      ? fallbackAnswers[detectedZone]
      : "Bambino World features 5 age-graded outdoor play sectors, live concerts, and all-inclusive treats at The Little Farm.";

    return res.json({
      reply,
      focusZone: detectedZone,
    });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        }))
      : [];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const replyText = response.text || "I'm excited for your family to join us at Bambino World! Let me know if you need any directions or schedule tips.";

    // If Gemini mentioned one of our zones in text, prioritize that zone
    for (const [kw, zId] of Object.entries(zoneKeywords)) {
      if (replyText.toLowerCase().includes(kw) && !detectedZone) {
        detectedZone = zId;
        break;
      }
    }

    return res.json({
      reply: replyText,
      focusZone: detectedZone,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.json({
      reply: "Bambino World welcomes you! You can explore all our play zones on the interactive 3D map above, check the December 5th schedule, or book passes anytime.",
      focusZone: detectedZone,
    });
  }
});

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
