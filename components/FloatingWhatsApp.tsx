"use client";
import Link from "next/link";

export default function FloatingWhatsApp() {
  const href = "/api/wa?text=" + encodeURIComponent("Hi ButterBee");

  return (
    <Link
      href={href}
      target="_blank"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-50 group"
    >
      <span className="sr-only">WhatsApp</span>
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14 drop-shadow-lg transition-transform group-active:scale-95"
        aria-hidden="true"
      >
        {/* soft green gradient */}
        <defs>
          <linearGradient id="waG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2EEA62" />
            <stop offset="1" stopColor="#25D366" />
          </linearGradient>
        </defs>

        {/* circle background */}
        <circle cx="32" cy="32" r="28" fill="url(#waG)" />
        {/* thin outline ring */}
        <circle cx="32" cy="32" r="28" fill="none" stroke="#128C7E" strokeWidth="2" opacity=".25" />

        {/* WhatsApp bubble + phone glyph (white) */}
        <g transform="translate(8,8)" fill="#fff">
          {/* chat bubble shape */}
          <path d="M27.51 4.5C24.74 1.74 21.07.2 17.2.2 9.18.2 2.7 6.67 2.7 14.69c0 2.49.65 4.91 1.89 7.05L2 31.8l10.27-2.69c2.06 1.12 4.39 1.71 6.73 1.71h.01c8.02 0 14.49-6.47 14.49-14.49 0-3.87-1.53-7.54-4.49-10.49zm-10.31 24.4h-.01c-2.06 0-4.07-.55-5.83-1.59l-.42-.25-6.1 1.6 1.63-5.94-.27-.43c-1.16-1.88-1.77-4.04-1.77-6.25 0-6.6 5.37-11.97 11.98-11.97 3.2 0 6.21 1.25 8.47 3.51 2.26 2.27 3.51 5.28 3.51 8.48 0 6.6-5.37 11.98-11.98 11.98z"/>
          {/* handset detail */}
          <path d="M19.11 17.2c-.27-.13-1.58-.78-1.82-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.04-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.14-1.33-.79-.7-1.32-1.57-1.47-1.83-.15-.27-.02-.41.11-.54.11-.11.24-.27.36-.4.12-.13.16-.22.25-.36.08-.13.04-.27-.02-.4-.06-.13-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.46-.16 0-.34-.02-.52-.02-.18 0-.47.07-.72.33-.24.27-.95.93-.95 2.27s.98 2.63 1.12 2.81c.13.18 1.93 2.94 4.66 4.13.65.28 1.15.45 1.55.58.65.21 1.23.18 1.69.11.51-.07 1.58-.64 1.8-1.27.22-.62.22-1.16.15-1.27-.07-.11-.24-.18-.51-.31z"/>
        </g>
      </svg>
    </Link>
  );
}
