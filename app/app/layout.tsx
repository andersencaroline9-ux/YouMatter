import type { Metadata } from "next";
import "./globals.css";
import "./adventures.css";
import "./site-shell.css";

export const metadata: Metadata = {
  title: "You Matter — Choose Your Adventure",
  description: "Small daily practices made visible: gratitude, nature and kindness, grown together.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
