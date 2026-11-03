import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Ticket,
  Check,
  X,
  Sparkles,
  QrCode,
  Phone,
  Mail,
  User,
  Copy,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Booking } from '../types/festival';
import { SIBLING_DISCOUNTS } from '../data/festivalData';
import { soundscape } from '../utils/soundscape';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  userEmail?: string | null;
  initialChildCount?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBookingSuccess,
  userEmail,
  initialChildCount
}) => {
  const [ticketType, setTicketType] = useState<'early-bird' | 'standard' | 'gate'>('early-bird');
  const [childCount, setChildCount] = useState<number>(initialChildCount || 1);
  const [underTwoCount, setUnderTwoCount] = useState<number>(0);
  const [adultCount] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>(userEmail || '');
  const [phone, setPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'ecocash' | 'pay-later' | 'gate'>('ecocash');
  const [ecoCashRef, setEcoCashRef] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Sync initialChildCount when opened
  useEffect(() => {
    if (isOpen && initialChildCount && initialChildCount > 0) {
      setChildCount(initialChildCount);
    }
  }, [isOpen, initialChildCount]);

  if (!isOpen) return null;

  // Sibling discount pricing calculation
  const calculateTotal = (): number => {
    if (ticketType === 'early-bird') {
      if (childCount in SIBLING_DISCOUNTS) {
        return SIBLING_DISCOUNTS[childCount];
      }
      return 70 + (childCount - 4) * 20;
    } else if (ticketType === 'standard') {
      return childCount * 30;
    } else {
      return childCount * 35;
    }
  };

  const total = calculateTotal();
  const ussdCode = `*151*1*1*0779140417*${total}#`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    soundscape.playMarimbaClick(680, 0.08);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          ticketType,
          adultCount,
          childCount,
          total,
          paymentMethod,
          notes: ecoCashRef ? `[EcoCash Ref: ${ecoCashRef}]` : ''
        })
      });

      const data = await res.json();
      const newBooking: Booking = data.booking || {
        id: `BW-${Date.now().toString(36).toUpperCase()}`,
        name,
        email,
        phone,
        ticketType,
        adultCount,
        childCount,
        total,
        paymentMethod,
        wristbandCode: `WB-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString()
      };

      setCompletedBooking(newBooking);
      onBookingSuccess(newBooking);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#31006F]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F4] border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto text-slate-900 relative pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] font-sans">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white hover:bg-[#31006F] hover:text-white active:scale-95 text-slate-700 flex items-center justify-center font-bold transition cursor-pointer z-10 border border-slate-200 shadow-xs"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {completedBooking ? (
          /* Confirmation Screen in Thompson Card Architecture */
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 text-[#FF6720] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-poppins font-black text-[#31006F] pt-1">
                See You at The Little Farm!
              </h2>
              <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-md mx-auto">
                Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT<br />
                5 Richwell Ave, Meyrick Park, Mabelreign, Harare
              </p>
            </div>

            {/* Perforated Digital Wristband Stub */}
            <div className="bg-[#31006F] text-white rounded-3xl p-6 sm:p-7 max-w-md mx-auto text-left space-y-4 shadow-xl border border-[#260058] font-poppins">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="space-y-0.5">
                  <div className="thompson-badge bg-[#F6BE00] text-slate-950 text-[10px]">
                    BAMBINO EXPLORER PASS
                  </div>
                  <div className="text-lg font-black text-white pt-1">
                    {completedBooking.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Total Paid</div>
                  <div className="text-xl font-black text-[#F6BE00]">${completedBooking.total} USD</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/70 block text-[10px] uppercase font-bold">Wristband ID</span>
                  <span className="font-mono font-bold text-[#F6BE00]">{completedBooking.wristbandCode}</span>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px] uppercase font-bold">Children</span>
                  <span className="font-bold text-white">{completedBooking.childCount} Child Pass(es)</span>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px] uppercase font-bold">Pass Tier</span>
                  <span className="font-bold text-white capitalize">{completedBooking.ticketType.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-white/70 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-bold text-white capitalize">{completedBooking.paymentMethod}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-white/20 my-2" />

              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#F6BE00]" />
                  <span>Show wristband code at Main Gate</span>
                </span>
                <span className="text-[10px] font-bold text-[#F6BE00] bg-white/10 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🎉 We reserved our Bambino World Festival Passes for Saturday 5 Dec 2026 at The Little Farm! Wristband ID: ${completedBooking.wristbandCode}. See you there! 🎪`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="thompson-pill-btn bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-6 py-3 text-xs sm:text-sm font-bold shadow-md"
              >
                <Phone className="w-4 h-4 fill-current shrink-0" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="thompson-pill-btn thompson-pill-purple px-6 py-3 text-xs sm:text-sm font-bold shadow-md"
              >
                <span>Done &amp; Explore Grounds</span>
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form in Thompson Design System */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="pr-10 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-poppins font-black text-[#31006F] leading-tight">
                Reserve Festival Passes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans">
                Saturday 5 December 2026 · The Little Farm · All passes include lunch, unlimited sweet treats, live shows &amp; all 5 zones.
              </p>
            </div>

            {/* Perforated Physical Festival Ticket Stub Preview in Thompson Card Style */}
            <div className="thompson-card p-5 relative border-l-4 border-l-[#FF6720] shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Left: Pass Brand, Guest Name & Date */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="thompson-badge bg-[#31006F] text-white text-[10px]">
                      <Sparkles className="w-3 h-3 text-[#F6BE00]" />
                      <span>{ticketType.replace('-', ' ')} Pass</span>
                    </span>
                    </div>

                  <h3 className="font-poppins font-bold text-lg sm:text-xl text-slate-900 tracking-tight break-words">
                    {name.trim() ? name : 'Family Explorer'} Pass
                  </h3>

                  <p className="text-xs text-slate-600 font-sans flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{childCount} Child Pass{childCount > 1 ? 'es' : ''}</span>
                    {underTwoCount > 0 && <span>· {underTwoCount} Under 2 (Free)</span>}
                    <span>· All 5 Zones Included</span>
                  </p>
                </div>

                {/* Right: Price */}
                <div className="sm:text-right shrink-0 flex items-center sm:flex-col justify-between sm:justify-center border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                  <div>
                    <span className="text-[10px] uppercase font-poppins font-bold tracking-wider text-slate-400 block">
                      Total Due
                    </span>
                    <span className="font-poppins font-black text-2xl sm:text-3xl text-[#31006F] leading-tight">
                      ${total}
                    </span>
                  </div>
                  <span className="text-[10px] font-poppins text-[#2F532E] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    EcoCash &amp; USD
                  </span>
                </div>

              </div>

              {/* Barcode & Security Strip */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[11px]">BW-FEST-2026-HARARE</span>
                </div>
                <div className="ticket-barcode w-24">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 3].map((w, idx) => (
                    <span key={idx} style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Ticket Tier Selector */}
            <div className="space-y-1.5">
              <span className="block text-xs font-poppins font-bold text-slate-700 uppercase tracking-wider">
                Admission Tier
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { type: 'early-bird', label: 'Early Bird', price: '$25', note: 'Sibling Discounts' },
                  { type: 'standard', label: 'Standard', price: '$30', note: 'Online Tier' },
                  { type: 'gate', label: 'At Gate', price: '$35', note: 'Pay on Arrival' }
                ].map(tier => (
                  <button
                    key={tier.type}
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(tier.type === 'early-bird' ? 620 : 520, 0.05);
                      setTicketType(tier.type as any);
                    }}
                    className={`min-h-[68px] p-3 rounded-2xl border text-center transition cursor-pointer font-poppins ${
                      ticketType === tier.type
                        ? 'bg-[#31006F] text-white border-[#31006F] shadow-md scale-[1.01]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-bold ${ticketType === tier.type ? 'text-white/80' : 'text-slate-500'}`}>
                      {tier.label}
                    </div>
                    <div className="text-xl font-black my-0.5">{tier.price}</div>
                    <div className={`text-[10px] font-medium break-words ${ticketType === tier.type ? 'text-[#F6BE00]' : 'text-[#2F532E]'}`}>
                      {tier.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Child Counters in Thompson Card Geometry */}
            <div className="thompson-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-poppins font-bold text-slate-900">
                    Children (Ages 3–12)
                  </div>
                  <div className="text-xs text-slate-500 font-sans">
                    Includes all 5 zones, child lunch pack &amp; sweet treats
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(440, 0.04);
                      setChildCount(Math.max(1, childCount - 1));
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white active:scale-95 text-slate-800 font-poppins font-bold flex items-center justify-center cursor-pointer text-base transition-colors"
                    aria-label="Decrease child count"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-poppins font-bold text-lg text-[#31006F]">{childCount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(560, 0.05);
                      setChildCount(childCount + 1);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white active:scale-95 text-slate-800 font-poppins font-bold flex items-center justify-center cursor-pointer text-base transition-colors"
                    aria-label="Increase child count"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <div className="text-sm font-poppins font-bold text-slate-900">
                    Babies &amp; Toddlers (2 and Under)
                  </div>
                  <div className="text-xs text-[#2F532E] font-poppins font-semibold">
                    FREE admission with attending family
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(420, 0.04);
                      setUnderTwoCount(Math.max(0, underTwoCount - 1));
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white active:scale-95 text-slate-800 font-poppins font-bold flex items-center justify-center cursor-pointer text-base transition-colors"
                    aria-label="Decrease toddler count"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-poppins font-bold text-lg text-[#31006F]">{underTwoCount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      soundscape.playMarimbaClick(540, 0.05);
                      setUnderTwoCount(underTwoCount + 1);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#FF6720] hover:text-white active:scale-95 text-slate-800 font-poppins font-bold flex items-center justify-center cursor-pointer text-base transition-colors"
                    aria-label="Increase toddler count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Parent Details with Strict Clean Form Semantics (Zero Placeholder Noise) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parent-name" className="block text-xs font-poppins font-bold text-slate-800 mb-1.5">
                  Parent or Guardian Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="parent-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6720] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="parent-email" className="block text-xs font-poppins font-bold text-slate-800 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="parent-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6720] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="parent-phone" className="block text-xs font-poppins font-bold text-slate-800 mb-1.5">
                  WhatsApp or Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="parent-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6720] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="payment-method" className="block text-xs font-poppins font-bold text-slate-800 mb-1.5">
                  Payment Preference
                </label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6720] min-h-[44px]"
                >
                  <option value="ecocash">EcoCash USSD (Direct Mobile)</option>
                  <option value="pay-later">WhatsApp Direct Coordination</option>
                  <option value="gate">Pay in USD Cash on Arrival</option>
                </select>
              </div>
            </div>

            {/* EcoCash Payment Box in Thompson Card Architecture */}
            {paymentMethod === 'ecocash' && (
              <div className="bg-[#FAF8F4] border border-[#FF6720]/40 rounded-2xl p-4 sm:p-5 text-slate-800 space-y-3">
                <div className="font-poppins font-bold text-slate-900 flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5 text-[#31006F]">
                    <ShieldCheck className="w-4 h-4 text-[#FF6720]" />
                    <span>EcoCash USSD Payment:</span>
                  </span>
                  <span className="text-xs bg-[#FF6720] text-white px-2.5 py-0.5 rounded-full font-bold">
                    ${total} USD Total
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <code className="font-mono font-bold text-sm sm:text-base text-slate-900 flex-1 select-all tracking-wide break-all">
                    {ussdCode}
                  </code>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(ussdCode);
                        setCopiedCode(true);
                        soundscape.playMarimbaClick(700, 0.05);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="thompson-pill-btn thompson-pill-purple px-3.5 py-1.5 text-xs font-bold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <a
                      href={`tel:*151*1*1*0779140417*${total}%23`}
                      className="thompson-pill-btn thompson-pill-orange px-3.5 py-1.5 text-xs font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Dial</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Dial the code above or transfer <strong>${total}</strong> to <strong>0779 140 417</strong> (*151# &rarr; Send Money).
                </p>

                <div>
                  <label htmlFor="ecocash-ref" className="block text-xs font-poppins font-bold text-slate-800 mb-1">
                    EcoCash Approval or Reference Code (Optional)
                  </label>
                  <input
                    id="ecocash-ref"
                    type="text"
                    value={ecoCashRef}
                    onChange={e => setEcoCashRef(e.target.value)}
                    className="w-full px-3 py-2 text-base sm:text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6720] min-h-[44px]"
                  />
                </div>
              </div>
            )}

            {/* Total Summary & Primary Actions */}
            <div className="bg-[#31006F] text-white rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="text-xs font-poppins font-bold text-white/70 uppercase tracking-wider">
                  Total Admission
                </div>
                <div className="text-3xl font-poppins font-black text-white flex items-baseline">
                  ${total}
                  <span className="text-xs font-poppins font-semibold text-white/80 ml-1.5">USD</span>
                  {ticketType === 'early-bird' && childCount > 1 && (
                    <span className="text-xs font-poppins font-bold text-[#F6BE00] bg-white/10 px-2.5 py-0.5 rounded-full ml-3">
                      Sibling bundle applied
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`https://wa.me/263779140417?text=${encodeURIComponent(
                    `🎪 Bambino World Festival Booking Request:\n` +
                    `• Parent/Name: ${name.trim() || 'Parent'}\n` +
                    `• Children: ${childCount} Child Pass(es)${underTwoCount > 0 ? ` + ${underTwoCount} Under 2 (Free)` : ''}\n` +
                    `• Pass Type: ${ticketType.replace('-', ' ').toUpperCase()}\n` +
                    `• Total Due: $${total} USD\n` +
                    `• Date: Saturday 5 Dec 2026 (10 AM - 5 PM)\n` +
                    `• Venue: The Little Farm, Meyrick Park, Harare\n` +
                    `• Payment: ${paymentMethod.toUpperCase()}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="thompson-pill-btn bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-poppins font-bold px-5 py-3 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 fill-current shrink-0" />
                  <span>Book via WhatsApp</span>
                </a>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="thompson-pill-btn thompson-pill-orange text-white font-poppins font-bold px-7 py-3 text-xs sm:text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm Family Pass'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
