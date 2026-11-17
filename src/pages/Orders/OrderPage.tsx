import { CheckCircle2, Clock3, MapPin, PackageCheck, ReceiptText, Truck } from 'lucide-react';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';

const orderItems = [
  { name: 'Aloo Paratha Plate', qty: 1, price: 99 },
  { name: 'Café Cold Brew', qty: 2, price: 238 },
  { name: 'Masala Fries Basket', qty: 1, price: 99 }
];

const statusSteps = [
  { label: 'Pending', active: true },
  { label: 'Accepted', active: true },
  { label: 'Preparing', active: true },
  { label: 'Ready', active: false },
  { label: 'Completed', active: false }
];

export function OrderPage() {
  const subtotal = orderItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="min-h-screen bg-[#FFF3E7] text-[#4A2922]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">Your order</p>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Order #BB-2048</h1>
          </div>
          <div className="rounded-full bg-[#FDE7DE] px-4 py-2 text-sm font-bold text-[#963F2B]">
            Status: Preparing
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="space-y-6">
            <div className="rounded-[30px] border border-[#F0D5C8] bg-white p-6 shadow-[0_16px_40px_rgba(74,41,34,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <Truck className="text-[#963F2B]" />
                <h2 className="font-display text-2xl font-semibold text-[#4A2922]">Order timeline</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-5">
                {statusSteps.map((step, index) => (
                  <div key={step.label} className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                        step.active
                          ? 'border-[#963F2B] bg-[#963F2B] text-white'
                          : 'border-[#EFCDBB] bg-[#FFF3E7] text-[#7C5A52]'
                      }`}
                    >
                      {step.active ? <CheckCircle2 size={18} /> : index + 1}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#4A2922]">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#F0D5C8] bg-white p-6 shadow-[0_16px_40px_rgba(74,41,34,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <PackageCheck className="text-[#963F2B]" />
                <h2 className="font-display text-2xl font-semibold text-[#4A2922]">Ordered items</h2>
              </div>

              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-[#FFF9F4] p-4">
                    <div>
                      <p className="font-semibold text-[#4A2922]">{item.name}</p>
                      <p className="text-sm text-[#6A4942]">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-[#963F2B]">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-[#F0D5C8] bg-white p-6 shadow-[0_16px_40px_rgba(74,41,34,0.05)]">
              <div className="mb-4 flex items-center gap-3">
                <ReceiptText className="text-[#963F2B]" />
                <h2 className="font-display text-2xl font-semibold text-[#4A2922]">Bill summary</h2>
              </div>

              <div className="space-y-3 text-sm text-[#573F3A]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Packaging</span>
                  <span>₹15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>₹24</span>
                </div>
                <hr className="my-2 border-[#F2D8CC]" />
                <div className="flex items-center justify-between text-base font-bold text-[#4A2922]">
                  <span>Total</span>
                  <span>₹{subtotal + 39}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#F0D5C8] bg-[#4A2922] p-6 text-white shadow-[0_16px_40px_rgba(74,41,34,0.12)]">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="text-[#F5C2A8]" />
                <h2 className="font-display text-2xl font-semibold">Pickup details</h2>
              </div>

              <p className="text-sm leading-7 text-[#F4D8CB]">
                Pickup counter: Canteen Block B <br />
                Estimated time: 12 minutes <br />
                Payment: Online / Paid
              </p>

              <div className="mt-5 rounded-2xl bg-white/8 p-4 text-sm text-[#F7E7DF]">
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#F5C2A8]" />
                  Last updated: 2 minutes ago
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
