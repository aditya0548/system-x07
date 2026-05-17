import type { Metadata } from "next";
import { cormorantGaramond, inter, spaceMono } from "../lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "System X-07",
  description: "Navigate the unknown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${inter.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
