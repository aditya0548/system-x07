"use client";

import React, { useEffect, useRef, useState } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Enhancement 3: Particles setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const particles = Array.from({ length: 24 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 160 + Math.random() * 120; // 160px - 280px
      return {
        angle,
        radius,
        speed: 0.002 + Math.random() * 0.005,
        inwardSpeed: 0.2 + Math.random() * 0.5,
        history: [] as { x: number; y: number }[],
      };
    });

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach((p) => {
        // Update position
        p.angle += p.speed * (300 / Math.max(p.radius, 20)); // faster when closer
        p.radius -= p.inwardSpeed;

        if (p.radius < 20) {
          p.angle = Math.random() * Math.PI * 2;
          p.radius = 160 + Math.random() * 120;
          p.history = [];
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        p.history.push({ x, y });
        if (p.history.length > 4) {
          p.history.shift();
        }

        // Draw trail
        if (p.history.length > 1) {
          for (let i = 0; i < p.history.length - 1; i++) {
            const h = p.history[i];
            const nextH = p.history[i + 1];
            ctx.beginPath();
            ctx.moveTo(h.x, h.y);
            ctx.lineTo(nextH.x, nextH.y);
            const alpha = ((i + 1) / p.history.length) * (p.radius / 280);
            ctx.strokeStyle = `rgba(255, 140, 0, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        const alpha = Math.max(0.1, Math.min(1, p.radius / 200));
        ctx.fillStyle = `rgba(255, 140, 0, ${alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
            transform: approaching ? "scale(1.6)" : "scale(0.5)",
            transition: approaching ? "transform 14s ease-in" : "none",
          }}
        >
          {/* Enhancement 1: Centering wrapper */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            className="flex items-center justify-center"
          >
            {/* Layer 1: Outer Glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: "800px",
                height: "800px",
                background:
                  "radial-gradient(circle, rgba(255,100,0,0.08) 0%, rgba(255,60,0,0.04) 30%, rgba(100,20,0,0.02) 60%, transparent 75%)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            />

            {/* Layer 1.5: Photon Ring Glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: "700px",
                height: "700px",
                background:
                  "radial-gradient(circle, transparent 130px, rgba(255,80,0,0.06) 160px, rgba(255,120,0,0.1) 180px, rgba(255,80,0,0.06) 200px, transparent 230px)",
              }}
            />

            {/* Layer 2: Accretion Disk (back) */}
            <div
              className="absolute rounded-full z-[1]"
              style={{
                width: "640px",
                height: "140px",
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(120,40,0,0.3) 10%, rgba(200,80,0,0.7) 20%, rgba(255,140,0,0.9) 30%, rgba(255,200,80,1) 35%, rgba(255,160,40,0.9) 40%, rgba(200,80,0,0.6) 50%, rgba(120,40,0,0.3) 60%, transparent 70%, transparent 100%)",
                filter: "blur(6px)",
                animation: "rotate 16s linear infinite",
                transformOrigin: "center center",
              }}
            />

            {/* Layer 3: Black Sphere */}
            <div
              className="absolute rounded-full z-[3]"
              style={{
                width: "320px",
                height: "320px",
                background: "radial-gradient(circle at 35% 35%, #0a0a0f, #000004)",
                boxShadow:
                  "0 0 60px rgba(0,0,0,1), 0 0 120px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,1)",
              }}
            />

            {/* Layer 4: Accretion Disk (front) */}
            <div
              className="absolute rounded-full z-[4]"
              style={{
                width: "640px",
                height: "140px",
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(120,40,0,0.3) 10%, rgba(200,80,0,0.7) 20%, rgba(255,140,0,0.9) 30%, rgba(255,200,80,1) 35%, rgba(255,160,40,0.9) 40%, rgba(200,80,0,0.6) 50%, rgba(120,40,0,0.3) 60%, transparent 70%, transparent 100%)",
                filter: "blur(3px)",
                animation: "rotate 16s linear infinite",
                transformOrigin: "center center",
                clipPath: "ellipse(310px 60px at 50% 50%)",
                opacity: 0.85,
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

            {/* Layer 6: Particle Streams (Canvas) */}
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="absolute z-[2] pointer-events-none"
            />

            {/* Layer 8: SVG filter overlay (Enhancement 6) */}
            <div
              className="absolute pointer-events-none opacity-40"
              style={{
                width: "800px",
                height: "800px",
                zIndex: 6,
                maskImage:
                  "radial-gradient(circle at 50% 50%, transparent 160px, black 250px)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, transparent 160px, black 250px)",
              }}
            >
              <svg width="100%" height="100%">
                <filter id="distort">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.015"
                    numOctaves="2"
                    seed="2"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="8"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  filter="url(#distort)"
                  opacity="0.3"
                />
              </svg>
            </div>
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
              textShadow: "-1px 0 rgba(255,0,0,0.3), 1px 0 rgba(0,0,255,0.3)",
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
              textShadow: "-1px 0 rgba(255,0,0,0.3), 1px 0 rgba(0,0,255,0.3)",
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
