import type { Metadata } from "next";
import "./globals.css";
import "./ai.css";

export const metadata: Metadata = {
  title: "Amir Music OS",
  description: "Private music production command center for ideas, Suno, releases, and analytics.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
