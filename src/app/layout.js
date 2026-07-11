import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Matias Fun Run & Walk 2026 | 4K & 2.5K",
  description: "Ikuti keseruan acara lari 4K dan jalan sehat 2.5K oleh Gereja Santo Matias Rasul Paroki Kosambi Baru. Daftar sekarang!",
  keywords: [
    "event lari",
    "event jakarta",
    "fun walk",
    "fun run",
    "paroki kosambi baru",
  ],
  authors: [{ name: "Panitia Matias Fun Run" }],
  openGraph: {
    title: "Matias Fun Run & Walk 2026 | 4K & 2.5K",
    description: "Ikuti keseruan acara lari 4K & jalan sehat 2.5K dari Gereja Santo Matias Rasul Paroki Kosambi Baru. Dapatkan Jersey, Medali, dan BIB!",
    url: "https://matias-funrun.my.id",
    siteName: "Matias Fun Run & Walk 2026",
    images: [
      {
        url: "https://matias-funrun.my.id/logo-matias-run.png",
        width: 800,
        height: 600,
        alt: "Logo Matias Fun Run & Walk 2026",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matias Fun Run & Walk 2026 | 4K & 2.5K",
    description: "Ikuti keseruan acara lari 4K & jalan sehat 2.5K dari Gereja Santo Matias Rasul Paroki Kosambi Baru.",
    images: ["https://matias-funrun.my.id/logo-matias-run.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for the Event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Matias Fun Run & Walk 2026 | 4K & 2.5K",
    "description": "Acara lari komunitas 4K dan jalan sehat 2.5K yang diselenggarakan oleh Gereja Santo Matias Rasul Paroki Kosambi Baru.",
    "image": [
      "https://matias-funrun.my.id/logo-matias-run.png"
    ],
    "startDate": "2026-12-05T06:00:00+07:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Paroki Kosambi Baru – Gereja St. Matias Rasul",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jakarta Barat",
        "addressRegion": "DKI Jakarta",
        "addressCountry": "ID"
      }
    },
    "offers": [
      
      {
        "@type": "Offer",
        "name": "Early Bird 1",
        "price": "125000",
        "priceCurrency": "IDR",
        "validFrom": "2026-07-10",
        "validThrough": "2026-07-30T23:59:59+07:00",
        "availability": "https://schema.org/InStock",
        "url": "https://matias-funrun.my.id/register"
      },
      {
        "@type": "Offer",
        "name": "Early Bird 2",
        "price": "150000",
        "priceCurrency": "IDR",
        "validFrom": "2026-08-10",
        "validThrough": "2026-09-30T23:59:59+07:00",
        "availability": "https://schema.org/InStock",
        "url": "https://matias-funrun.my.id/register"
      },
      {
        "@type": "Offer",
        "name": "Normal Ticket",
        "price": "175000",
        "priceCurrency": "IDR",
        "validFrom": "2026-10-4",
        "validThrough": "2026-11-20T23:59:59+07:00",
        "availability": "https://schema.org/InStock",
        "url": "https://matias-funrun.my.id/register"
      }
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Gereja Santo Matias Rasul Paroki Kosambi Baru",
      "url": "https://matias-funrun.my.id"
    }
  };

  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
