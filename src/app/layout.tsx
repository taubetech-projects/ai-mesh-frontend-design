import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { fetchMe } from "@/lib/auth/me";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Mesh",
  description: "Harness the power of next-generation conversational AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const me = await fetchMe();
  // console.log("me:", me);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers initialMe={me}>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
