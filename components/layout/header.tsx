'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SignIn } from "../SignIn";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { NONCE } from "@/utils/utils";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    useEffect(() => {
  
  
      MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async payload => {
        if (payload.status === 'error') {
          return
        } else {
          const response = await fetch('/api/complete-siwe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payload: payload,
              nonce:NONCE,
            }),
          })
        }
      })
    
      return () => {
        MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth)
      }
    }, [])
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
    <div className=" flex h-14 items-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/dealnodeal.webp" alt="Logo" width={32} height={32} className="rounded-full" />
        <span className="font-bold text-lg hidden sm:inline-block">Deel No Deel</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-4 items-center">
      <Button asChild>
          <Link href="/rooms/join">Join Room</Link>
          </Button>
         <Button asChild>
          <Link href="/rooms/create">Create Room</Link>
          </Button>
        <SignIn />
      </nav>
      <button
        className="ml-auto md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
    {mobileMenuOpen && (
      <nav className="md:hidden p-4 bg-background border-t flex flex-col gap-4">
          <Button asChild>
          <Link href="/rooms/join">Join Room</Link>
          </Button>
         <Button asChild>
          <Link href="/rooms/create">Create Room</Link>
          </Button>
         <SignIn />
      </nav>
    )}
  </header>
  )
}
