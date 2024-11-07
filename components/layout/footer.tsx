import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-background">
    <div className="px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/dealnodeal.webp" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="font-bold">Deel No Deel Worldchain</span>
          </Link>
          <p className="mt-2 text-center md:text-left text-sm text-muted-foreground">
            © 2023 Deal or No Deal Worldchain. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </footer>
  )
}
