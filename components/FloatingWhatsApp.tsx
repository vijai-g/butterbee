"use client";

type Props = {
  /** Optional: override the env number; digits only (e.g. "919876543210") */
  phone?: string;
  /** Optional: prefill message */
  text?: string;
  /** Optional: hide on certain routes, etc. */
  hidden?: boolean;
};

function onlyDigits(s: string) {
  return s.replace(/\D+/g, "");
}

export default function FloatingWhatsApp({ phone, text, hidden }: Props) {
  if (hidden) return null;

  const envNum =
    typeof process !== "undefined"
      ? (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER as string | undefined)
      : undefined;

  const number = phone ? onlyDigits(phone) : envNum ? onlyDigits(envNum) : "";
  if (!number) return null;

  const url =
    `https://wa.me/${number}` +
    (text ? `?text=${encodeURIComponent(text)}` : "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span
        className="
          block h-14 w-14 rounded-full
          shadow-lg ring-1 ring-black/10
          transition transform hover:scale-105 active:scale-95
          bg-[#25D366]  /* official brand green */
          flex items-center justify-center
        "
      >
        {/* use your file under /public/images/WhatsApp.png */}
        <img src="/images/WhatsApp.png" alt="" className="h-8 w-8" />
      </span>

      <span
        className="
          pointer-events-none absolute right-0 mr-16 top-1/2 -translate-y-1/2
          rounded-lg bg-black/80 px-2 py-1 text-xs text-white opacity-0
          transition-opacity group-hover:opacity-100
        "
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}
