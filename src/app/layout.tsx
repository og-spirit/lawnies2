import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawnies — 24/7 Call Answering for Lawn Operators",
  description:
    "Stop losing lawn jobs when you're on the mower. Get every call answered while you work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
