'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SignIn } from "../SignIn";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
    <div className=" flex h-14 items-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/dealnodeal.webp" alt="Logo" width={32} height={32} className="rounded-full" />
        <span className="font-bold text-lg hidden sm:inline-block">Deel No Deel</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-4 items-center">
        <Button >Play Now</Button>
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
         <Button >Play Now</Button>
         <SignIn />
      </nav>
    )}
  </header>
  )
}