"use client";

import React, { useEffect, useState } from "react";

export interface BlackHoleSceneProps {
  onComplete: () => void;
}

export default function BlackHoleScene({ onComplete }: BlackHoleSceneProps) {
  const [showBlackHole, setShowBlackHole] = useState(false);
  const [approaching, setApproaching] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [flash, setFlash] = useState(false);
  const [fadeBlack, setFadeBlack] = useState(false);

  useEffect(() => {
    // 0s: black hole appears
    const t0 = setTimeout(() => setShowBlackHole(true), 0);

    // 2s: camera approach starts
    const t2 = setTimeout(() => setApproaching(true), 2000);

    // 8s: text line 1
    const t8 = setTimeout(() => setShowText1(true), 8000);

    // 10s: text line 2
    const t10 = setTimeout(() => setShowText2(true), 10000);

    // 12s: white flash
    const t12 = setTimeout(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 500); // flash duration
    }, 12000);

    // 13s: fade to black
    const t13 = setTimeout(() => setFadeBlack(true), 13000);

    // 14s: complete
    const t14 = setTimeout(() => onComplete(), 14000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t2);
      clearTimeout(t8);
      clearTimeout(t10);
      clearTimeout(t12);
      clearTimeout(t13);
      clearTimeout(t14);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes streamPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Main container */}
      <div
        className="fixed inset-0 bg-[#000008] z-[100] flex items-center justify-center overflow-hidden"
        style={{
          opacity: showBlackHole ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        {/* Camera wrapper */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: approaching ? "scale(1.4)" : "scale(0.6)",
            transition: approaching ? "transform 10s ease-in" : "none",
          }}
        >
          {/* Layer 1: Outer Glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, rgba(255,140,0,0.04) 0%, rgba(255,100,0,0.02) 40%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          />

          {/* Layer 2: Accretion Disk (back) */}
          <div
            className="absolute rounded-full z-[1]"
            style={{
              width: "520px",
              height: "130px",
              background:
                "linear-gradient(to right, transparent 0%, rgba(255,80,0,0.15) 20%, rgba(255,140,0,0.5) 40%, rgba(255,200,100,0.8) 50%, rgba(255,140,0,0.5) 60%, rgba(255,80,0,0.15) 80%, transparent 100%)",
              filter: "blur(8px)",
              animation: "rotate 12s linear infinite",
              transformOrigin: "center center",
            }}
          />

          {/* Layer 3: Black Sphere */}
          <div
            className="absolute rounded-full z-[3]"
            style={{
              width: "280px",
              height: "280px",
              background: "radial-gradient(circle at 35% 35%, #0a0a0f, #000004)",
              boxShadow:
                "0 0 60px rgba(0,0,0,1), 0 0 120px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,1)",
            }}
          />

          {/* Layer 4: Accretion Disk (front) */}
          <div
            className="absolute rounded-full z-[4]"
            style={{
              width: "520px",
              height: "130px",
              background:
                "linear-gradient(to right, transparent 0%, rgba(255,80,0,0.15) 20%, rgba(255,140,0,0.5) 40%, rgba(255,200,100,0.8) 50%, rgba(255,140,0,0.5) 60%, rgba(255,80,0,0.15) 80%, transparent 100%)",
              filter: "blur(4px)",
              animation: "rotate 12s linear infinite",
              transformOrigin: "center center",
              clipPath: "ellipse(260px 65px at 50% 50%)",
              opacity: 0.7,
            }}
          />

          {/* Layer 5: Gravitational Lensing Ring */}
          <div
            className="absolute rounded-full z-[2] bg-transparent"
            style={{
              width: "320px",
              height: "320px",
              border: "2px solid rgba(255,140,0,0.15)",
              boxShadow:
                "0 0 20px rgba(255,140,0,0.1), inset 0 0 20px rgba(255,140,0,0.05)",
              animation: "rotateReverse 20s linear infinite",
            }}
          />

          {/* Layer 6: Particle Streams */}
          <div className="absolute flex items-center justify-center w-full h-full z-[2]">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <div
                key={angle}
                className="absolute"
                style={{
                  width: "1px",
                  height: "80px",
                  background:
                    "linear-gradient(to bottom, rgba(255,140,0,0.6), transparent)",
                  transformOrigin: "bottom center",
                  transform: `rotate(${angle}deg) translateY(-140px)`,
                  animation: `streamPulse 2s ease-in-out infinite`,
                  animationDelay: `${index * 0.25}s`,
                }}
              />
            ))}
          </div>

          {/* Layer 7: Lens Distortion Overlay */}
          <div
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 120px, rgba(0,0,8,0.3) 200px, rgba(0,0,8,0.6) 280px, rgba(0,0,8,0.9) 380px, #000008 500px)",
            }}
          />
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-[25%] w-full text-center z-[6] pointer-events-none flex flex-col items-center justify-center">
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "32px",
              fontStyle: "italic",
              color: "rgba(255,200,100,0.7)",
              opacity: showText1 ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            Beyond known space...
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.5em",
              color: "rgba(255,140,0,0.5)",
              opacity: showText2 ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              marginTop: "16px",
            }}
          >
            Approaching System X-07
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          data-cursor="hover"
          className="fixed bottom-[32px] right-[32px] z-[10] font-mono hover:text-[rgba(255,140,0,0.8)] transition-colors"
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,140,0,0.4)",
          }}
        >
          SKIP ›
        </button>

        {/* White Flash Effect */}
        <div
          className="fixed inset-0 bg-white z-[20] pointer-events-none"
          style={{
            opacity: flash ? 1 : 0,
            transition: "opacity 0.25s ease-in-out",
          }}
        />

        {/* Fade to Black Effect */}
        <div
          className="fixed inset-0 bg-[#000008] z-[30] pointer-events-none"
          style={{
            opacity: fadeBlack ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>
    </>
  );
}
