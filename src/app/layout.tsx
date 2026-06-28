import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import EkaHelpBot from "@/components/EkaHelpBot";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "EKA — Protected Local Service Marketplace",
  description:
    "EKA connects customers with trusted local service providers using protected booking, cashback, warranty, provider alerts and trust score.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          {children}
          <EkaHelpBot />
        </I18nProvider>
      </body>
    </html>
  );
}