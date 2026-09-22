import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRkan — QR Code Generator",
  description: "HARIKITTE IKOU!!!!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}