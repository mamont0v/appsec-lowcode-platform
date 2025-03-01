import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers/providers";
import { redirect } from "next/navigation";
import { DM_Sans, Poppins } from "next/font/google";
import { cn } from '../lib/utils';

export const metadata: Metadata = {
  title: "Inspector Security",
  description: "Платформа для кибербезопасности",
  icons: {
    icon: "/agent-colorized.svg",
  },
};



const font = DM_Sans({
  subsets: ["latin"],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        {/* <body className=antialiased min-h-screen pt-1 */}
        <body className={cn(font.className, "antialiased")}>
          <Providers>
            <Toaster richColors />
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
