"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "../components/ui/CustomCursor";
import dynamic from "next/dynamic";

const SpaceshipScene = dynamic(
  () => import("../components/intro/SpaceshipScene"),
  { ssr: false }
);

const BlackHoleScene = dynamic(
  () => import("../components/intro/BlackHoleScene"),
  { ssr: false }
);

const LoadingScreen = dynamic(
  () => import("../components/ui/LoadingScreen"),
  { ssr: false }
);

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'spaceship' | 'cockpit' | 'blackhole' | 'space'>('loading');

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {phase === 'loading' && (
          <LoadingScreen onComplete={() => setPhase('spaceship')} />
        )}
      </AnimatePresence>

      {phase === 'spaceship' && (
        <SpaceshipScene onComplete={() => setPhase('cockpit')} />
      )}

      {phase === 'cockpit' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000008', zIndex: 100 }} />
      )}

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
