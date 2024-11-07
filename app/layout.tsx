"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { NONCE } from "@/utils/utils";
import { useEffect } from "react";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  
  return (
    <html lang="en">
        <NextAuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              <body className={inter.className}>
                <Header />
                {children}
                <Footer />
                </body>
            </MiniKitProvider>
          </ErudaProvider>
        </NextAuthProvider>
    </html>
  );
}
