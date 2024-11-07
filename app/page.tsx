import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerifyBlock } from "@/components/Verify";
import { Menu, X, ChevronRight, Briefcase, Shield, Coins, Users } from "lucide-react"
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden relative">
          {/* SVG Definitions */}
          <svg className="hidden">
            <defs>
              <symbol id="icon-dollar" viewBox="0 0 24 24">
                <path d="M12,1V23M17,5H9.5a3.5,3.5,0,0,0,0,7h5a3.5,3.5,0,0,1,0,7H6" 
                      stroke="currentColor" strokeWidth="2" fill="none" />
              </symbol>
              <symbol id="icon-suitcase" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="14" rx="2" ry="2" 
                      stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M8,7V5a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V7" 
                      stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="12" y1="12" x2="12" y2="16" 
                      stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="13" x2="21" y2="13" 
                      stroke="currentColor" strokeWidth="2" />
              </symbol>
            </defs>
          </svg>

          {/* Floating Elements */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 text-primary"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${0.5 + Math.random() * 0.5})`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <svg className="w-10 h-10">
                <use xlinkHref={Math.random() > 0.5 ? "#icon-dollar" : "#icon-suitcase"} />
              </svg>
            </div>
          ))}

          <div className="px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Deel No Deel: The Ultimate Immersive Game
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Join the excitement on Worldchain. Open briefcases, make deals, and win big with your World ID!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button  className="animate-pulse">
                  Play Now <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <SignIn />
              </div>
            </div>
          </div>
        </section>


        {/* How to Play Section */}
        <section id="how-to-play" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">How to Play</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Shield, title: "Connect with World ID", description: "Verify your identity using World ID to join the game securely." },
                { icon: Briefcase, title: "Choose Your Briefcase", description: "Select one of the 26 briefcases, each containing a hidden amount." },
                { icon: Coins, title: "Deel No Deel?", description: "Open cases, receive offers, and decide whether to make a deal or keep playing." }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-lg transition-transform hover:scale-105">
                  <div className="p-4 bg-primary text-primary-foreground rounded-full">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Game Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Briefcase, title: "Ownership", description: "Experience true ownership and transparency with Worldchain technology." },
                { icon: Shield, title: "Secure Identity", description: "Play with confidence using World ID verification for enhanced security." },
                { icon: Coins, title: "Real Crypto Prizes", description: "Win and withdraw real cryptocurrency directly to your wallet." },
                { icon: Users, title: "Global Community", description: "Connect with players worldwide and compete for the top spot on our leaderboard." }
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-6 bg-muted rounded-lg transition-colors hover:bg-muted/80">
                  <feature.icon className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Animation Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/20 to-purple-500/20 overflow-hidden">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Ready to Make a Deel?</h2>
              </div>
            
            </div>
          </div>
          <div className="mt-12 px-4 md:px-6 relative">
            <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-75" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl font-bold text-white animate-float">Deel No Deel</div>
              </div>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-white rounded-full animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </section>
 

      {/* <div className="container mx-auto max-w-4xl w-full items-center space-y-8">
        <h1 className="text-4xl font-bold  mb-12">
          World ID Integration
        </h1>
        <SignIn />
        <VerifyBlock />
        <PayBlock />
      </div> */}
    </main>
  );
}
