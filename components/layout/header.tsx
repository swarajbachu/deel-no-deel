"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Home, Users, PlusCircle, UserCircle } from "lucide-react";
import { SignIn } from "../SignIn";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { NONCE } from "@/utils/utils";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async (payload) => {
      if (payload.status === "error") {
        return;
      } else {
        const response = await fetch("/api/complete-siwe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: payload,
            nonce: NONCE,
          }),
        });
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:block hidden">
        <div className="flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/dealnodeal.webp"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-lg">Deel No Deel</span>
          </Link>
          <nav className="ml-auto flex gap-4 items-center">
            <Button asChild>
              <Link href="/rooms/join">Join Room</Link>
            </Button>
            <Button asChild>
              <Link href="/rooms/create">Create Room</Link>
            </Button>
            <SignIn />
          </nav>
        </div>
      </header>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex justify-around items-center h-16 md:hidden">
          <Link href="/" className="flex flex-col items-center justify-center">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/rooms/join"
            className="flex flex-col items-center justify-center"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Join</span>
          </Link>
          <Link
            href="/rooms/create"
            className="flex flex-col items-center justify-center"
          >
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Create</span>
          </Link>
        </nav>
      )}
    </>
  );
}
