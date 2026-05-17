"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "../components/ui/LoadingScreen";
import CustomCursor from "../components/ui/CustomCursor";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <CustomCursor />
      <AnimatePresence>
        {!loadingComplete && (
          <LoadingScreen onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>

      {loadingComplete && (
        <main className="w-screen h-screen bg-space flex items-center justify-center">
          <div className="text-star font-mono text-center">
            SYSTEM X-07
          </div>
        </main>
      )}
    </>
  );
}
