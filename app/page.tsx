import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl w-full items-center space-y-8">
        <h1 className="text-4xl font-bold  mb-12">
          World ID Integration
        </h1>
        <SignIn />
        <VerifyBlock />
        <PayBlock />
      </div>
    </main>
  );
}
