"use client";

import { SignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import { VerifyBlock } from "@/components/Verify";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Swords,
  Trophy,
  UserPlus,
  Gamepad2,
  Crown,
  Coins,
  Sparkles,
  Zap,
  Lock,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-24 lg:py-32 overflow-hidden relative px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl/none font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Deal or No Deal: World ID Edition
              </h1>
              <p className="text-sm md:text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join 2-8 players in an intense elimination game of strategy and deception. Verify your humanity, compete for crypto rewards, and become the ultimate champion!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8 w-full sm:w-auto">
              <SignIn />
              <Button variant="outline" className="group w-full sm:w-auto">
                Watch Tutorial
                <Gamepad2 className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why World ID Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="px-4 md:px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">Why Play With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Shield,
                title: "Sybil-Resistant Gaming",
                description: "World ID verification ensures each player is unique and human, preventing multi-accounting and maintaining fair play."
              },
              {
                icon: Coins,
                title: "Crypto Rewards",
                description: "Win and withdraw your crypto prizes instantly. No delays, no complications - just pure gaming excitement."
              },
              {
                icon: Zap,
                title: "Mini App Experience",
                description: "Quick to load, easy to play. Jump into games instantly with our optimized mini app architecture."
              },
              {
                icon: Users,
                title: "Flexible Lobbies",
                description: "Create or join rooms with 2, 4, or 8 players. More players mean more rounds and bigger prizes!"
              },
              {
                icon: Lock,
                title: "Secure & Transparent",
                description: "Every game action is verified and secured through World ID's proof of personhood protocol."
              },
              {
                icon: Sparkles,
                title: "Fair Competition",
                description: "Everyone plays on equal terms - no bots, no duplicate accounts, just pure strategy and skill."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-start p-4 md:p-6 bg-background/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-2 md:p-3 bg-primary/10 rounded-full mb-3 md:mb-4">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Flow Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">How to Play</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "1. Join a Room",
                description: "Enter a game room with 2, 4, or 8 players. The game begins when the room is full.",
                animation: "fade-right"
              },
              {
                icon: Swords,
                title: "2. Face Your Opponent",
                description: "Get paired randomly with another player for an intense case showdown.",
                animation: "fade-up"
              },
              {
                icon: Trophy,
                title: "3. Survive & Advance",
                description: "Win your duel to advance to the next round. Lose and you're eliminated.",
                animation: "fade-left"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center space-y-4 p-6 bg-background/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Game Rules Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="px-4 md:px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">Case Game Rules</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Crown,
                title: "Case Assignment",
                description: "One player becomes the case holder randomly"
              },
              {
                icon: Shield,
                title: "Declaration",
                description: "Case holder declares SAFE or ELIMINATE"
              },
              {
                icon: Gamepad2,
                title: "Decision Time",
                description: "Other player decides to take or leave the case"
              },
              {
                icon: Trophy,
                title: "Winner Selection",
                description: "Winner determined by case content and decision"
              }
            ].map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-background/40 rounded-xl backdrop-blur-sm"
              >
                <rule.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{rule.title}</h3>
                <p className="text-muted-foreground text-sm">{rule.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Win Conditions Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="px-4 md:px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8">Win Conditions</h2>
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-6 bg-background/80 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">SAFE Case Scenarios:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Take Decision: Case holder wins</li>
                <li>Leave Decision: Non-holder wins</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-6 bg-background/80 rounded-xl"
            >
              <h3 className="text-xl font-bold mb-4">ELIMINATE Case Scenarios:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Take Decision: Non-holder wins</li>
                <li>Leave Decision: Case holder wins</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-primary to-purple-500">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white mb-8">
            Ready to Test Your Strategy?
          </h2>
          <SignIn />
          <p className="mt-4 text-white/80">Join the ultimate elimination challenge!</p>
        </motion.div>
      </section>
    </main>
  );
}
