"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Total time is 3s (3000ms). Updates every 100ms.
        // So 30 updates total. 100 / 30 = 3.33% per update.
        return Math.min(prev + 100 / 30, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Call onComplete right after progress hits 100%
      const timeout = setTimeout(() => {
        onComplete();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000008",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "0.6em",
            color: "#00ff88",
            margin: 0,
          }}
        >
          SYSTEM X-07
        </h1>
        <p
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "rgba(0, 255, 136, 0.4)",
            marginTop: "8px",
            margin: 0,
          }}
        >
          INITIALIZING NAVIGATION SYSTEMS
        </p>
      </div>

      <div
        style={{
          width: "200px",
          height: "1px",
          backgroundColor: "rgba(0, 255, 136, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          style={{
            height: "100%",
            backgroundColor: "#00ff88",
          }}
        />
      </div>

      <div
        className="font-mono"
        style={{
          color: "#00ff88",
          fontSize: "10px",
        }}
      >
        {Math.round(progress)}%
      </div>
    </motion.div>
  );
}
