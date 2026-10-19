import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Ticket, Check, X, Shield, Sparkles, QrCode, Phone, Mail, User, Copy } from 'lucide-react';
import { Booking } from '../types/festival';
import { SIBLING_DISCOUNTS, TICKET_INCLUSIONS } from '../data/festivalData';

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
  const [adultCount, setAdultCount] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>(userEmail || '');
  const [phone, setPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'ecocash' | 'pay-later' | 'gate'>('ecocash');
  const [ecoCashRef, setEcoCashRef] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Sync initialChildCount when opened
  React.useEffect(() => {
    if (isOpen && initialChildCount && initialChildCount > 0) {
      setChildCount(initialChildCount);
    }
  }, [isOpen, initialChildCount]);

  if (!isOpen) return null;

  // Calculate price based on sibling logic
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
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
          notes: `${notes} ${ecoCashRef ? `[EcoCash Ref: ${ecoCashRef}]` : ''}`.trim()
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

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // Safe fallback
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#faf9f5] border-t sm:border border-slate-300 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto text-slate-900 relative pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Close Button - 44x44px touch target */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-slate-200/90 hover:bg-slate-300 active:scale-95 text-slate-700 flex items-center justify-center font-bold transition cursor-pointer z-10"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {completedBooking ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-kid font-black text-slate-900 mt-1">
                See You at <span className="kid-tilt-l text-emerald-600">The Little Farm</span>!
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Saturday 5 December 2026 · 10:00 AM – 5:00 PM CAT<br />
                Meyrick Park, Harare, Zimbabwe
              </p>
            </div>

            {/* Digital Wristband Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[11px] text-amber-400 font-extrabold uppercase">
                    Bambino Explorer Pass
                  </div>
                  <div className="text-lg font-black font-['Outfit']">{completedBooking.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Total Paid</div>
                  <div className="text-lg font-bold text-emerald-400">${completedBooking.total}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Wristband ID:</span>
                  <div className="font-mono font-bold text-amber-300">{completedBooking.wristbandCode}</div>
                </div>
                <div>
                  <span className="text-slate-400">Children:</span>
                  <div className="font-semibold">{completedBooking.childCount} Child Pass(es)</div>
                </div>
                <div>
                  <span className="text-slate-400">Pass Type:</span>
                  <div className="font-semibold capitalize">{completedBooking.ticketType.replace('-', ' ')}</div>
                </div>
                <div>
                  <span className="text-slate-400">Payment:</span>
                  <div className="font-semibold capitalize">{completedBooking.paymentMethod}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-amber-400" /> Show on arrival at Main Gate
                </span>
                <span className="text-[11px] font-bold text-emerald-400">Active</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="min-h-[44px] px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition cursor-pointer text-sm shadow-md"
              >
                Done &amp; Explore 3D Map
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
            <div className="pr-10">
              <h2 className="text-2xl sm:text-4xl font-kid font-black text-slate-900 mt-1">
                Bambino <span className="kid-tilt-l text-amber-500">Wonder Day</span> Tickets
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Saturday 5 December 2026 · All passes include lunch, unlimited candyfloss &amp; waffles, live shows &amp; all zones.
              </p>
            </div>

            {/* Ticket Tier Picker */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'early-bird', label: 'Early Bird', price: '$25', note: 'Sibling Discounts' },
                { type: 'standard', label: 'Standard', price: '$30', note: 'Online' },
                { type: 'gate', label: 'At Gate', price: '$35', note: 'Pay on Arrival' }
              ].map(tier => (
                <button
                  key={tier.type}
                  type="button"
                  onClick={() => setTicketType(tier.type as any)}
                  className={`min-h-[64px] p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer active:scale-98 ${
                    ticketType === tier.type
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-500 font-semibold">{tier.label}</div>
                  <div className="text-xl sm:text-2xl font-black font-['Outfit'] my-0.5">{tier.price}</div>
                  <div className="text-[10px] text-emerald-700 font-medium truncate">{tier.note}</div>
                </button>
              ))}
            </div>

            {/* Counters with Apple HIG 44x44px Buttons */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Children (Ages 3–12)</div>
                  <div className="text-[11px] text-slate-500">Includes all activities, lunch &amp; passport</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildCount(Math.max(1, childCount - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black flex items-center justify-center cursor-pointer text-lg"
                    aria-label="Decrease child count"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-base">{childCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildCount(childCount + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black flex items-center justify-center cursor-pointer text-lg"
                    aria-label="Increase child count"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Babies &amp; Toddlers (2 and Under)</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">FREE with paying sibling</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUnderTwoCount(Math.max(0, underTwoCount - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black flex items-center justify-center cursor-pointer text-lg"
                    aria-label="Decrease toddler count"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-base">{underTwoCount}</span>
                  <button
                    type="button"
                    onClick={() => setUnderTwoCount(underTwoCount + 1)}
                    className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black flex items-center justify-center cursor-pointer text-lg"
                    aria-label="Increase toddler count"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Parent Details - inputs at 16px to prevent iOS auto-zoom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sarah Moyo"
                    className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600 min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600 min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +263 77..."
                    className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600 min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-base sm:text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-emerald-600 min-h-[44px]"
                >
                  <option value="ecocash">EcoCash (Instant Confirmation)</option>
                  <option value="pay-later">Pay Later (WhatsApp follow-up)</option>
                  <option value="gate">Pay at Gate on Arrival</option>
                </select>
              </div>
            </div>

            {/* EcoCash Payment Box with Dynamic Shortcode */}
            {paymentMethod === 'ecocash' && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-2.5">
                <div className="font-extrabold text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>📱</span> EcoCash USSD Shortcode:
                  </span>
                  <span className="text-xs bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full font-bold">
                    ${total} Total
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-white border border-amber-300 rounded-xl shadow-2xs">
                  <code className="font-mono font-black text-sm sm:text-base text-slate-900 flex-1 select-all tracking-wide break-all">
                    *151*1*1*0779140417*{total}#
                  </code>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(`*151*1*1*0779140417*${total}#`);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="min-h-[36px] px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`tel:*151*1*1*0779140417*${total}%23`}
                      className="min-h-[36px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Dial</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-amber-900 leading-relaxed">
                  Dial from your phone or send <strong>${total}</strong> to <strong>0779 140 417</strong> (*151# &rarr; Send Money).
                </p>
                <div>
                  <input
                    type="text"
                    value={ecoCashRef}
                    onChange={e => setEcoCashRef(e.target.value)}
                    placeholder="Enter EcoCash approval / reference code (optional)"
                    className="w-full mt-1 px-3 py-2 text-base sm:text-xs bg-white border border-amber-300 rounded-xl text-slate-900 min-h-[44px]"
                  />
                </div>
              </div>
            )}

            {/* Total and Submit */}
            <div className="bg-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Total Amount</div>
                <div className="text-2xl font-black text-slate-900 font-['Outfit']">
                  ${total}
                  {ticketType === 'early-bird' && childCount > 1 && (
                    <span className="text-xs text-emerald-700 font-bold ml-2">Sibling rate applied</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold rounded-xl transition cursor-pointer text-sm shadow-md active:scale-98 flex items-center justify-center"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Family Pass'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
