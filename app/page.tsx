"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/ui/LoadingScreen";
import CustomCursor from "../components/ui/CustomCursor";
import BlackHoleScene from "../components/intro/BlackHoleScene";

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'blackhole' | 'space'>('loading');

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {phase === 'loading' && (
          <LoadingScreen onComplete={() => setPhase('blackhole')} />
        )}
      </AnimatePresence>

      {phase === 'blackhole' && (
        <BlackHoleScene onComplete={() => setPhase('space')} />
      )}

      {phase === 'space' && (
        <main className="w-screen h-screen bg-space flex items-center justify-center">
          <div className="text-star font-mono text-center">
            SYSTEM X-07 — NAVIGATION ACTIVE
          </div>
        </main>
      )}
    </>
  );
}
