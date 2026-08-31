import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QueueLess — Skip the wait. Not the service.",
  description:
    "Virtual queues for clinics, salons, restaurants and repair shops. Join remotely, track your spot live, get a text when it's your turn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}