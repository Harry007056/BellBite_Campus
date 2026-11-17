export function Footer() {
  return (
    <footer id="contact" className="bg-[#4A2922] text-[#FDF4ED]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#963F2B] text-xl">🐾</div>
            <div>
              <p className="font-display text-2xl font-semibold">BellBite</p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#F5B99F]">Campus</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-[#F0D7CE]">
            Smart, speedy and student-friendly campus dining for busy days, long lectures and midnight cravings.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-3 text-sm text-[#F0D7CE]">
            <li>Home</li>
            <li>Menu</li>
            <li>How It Works</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Campus Contact</h3>
          <ul className="space-y-3 text-sm text-[#F0D7CE]">
            <li>📍 Student Plaza, Campus Block A</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ hello@bellbitecampus.in</li>
            <li>⏰ Mon–Sat, 8:00 AM – 9:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#6C4039] py-5 text-center text-sm text-[#F8D9CD]">
        © 2026 BellBite Campus. Beat the Bell. Grab a Bite!
      </div>
    </footer>
  );
}
