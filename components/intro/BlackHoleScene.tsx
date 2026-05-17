"use client";

import React, { useEffect, useRef, useState } from "react";

export interface BlackHoleSceneProps {
  onComplete: () => void;
}

export default function BlackHoleScene({ onComplete }: BlackHoleSceneProps) {
  const [showBlackHole, setShowBlackHole] = useState(false);
  const [scale, setScale] = useState(0.4);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [flash, setFlash] = useState(false);
  const [fadeBlack, setFadeBlack] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Layer 7: Star Particles setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const bgParticles = Array.from({ length: 80 }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: 140 + Math.random() * 150, // 140 - 290
      size: 0.5 + Math.random(), // 0.5 - 1.5px
      opacity: 0.3 + Math.random() * 0.5, // 0.3 - 0.8
    }));

    const diskParticles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: 240 + Math.random() * 20, // 240 - 260px
      speed: 2 + Math.random() * 3,
    }));

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw background drifting particles
      bgParticles.forEach((p) => {
        p.radius -= 0.02;

        if (p.radius < 140) {
          p.radius = 250 + Math.random() * 40; // respawn at 250-290
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        let currentOpacity = p.opacity;
        if (p.radius < 150) {
          currentOpacity = p.opacity * ((p.radius - 140) / 10);
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, currentOpacity)})`;
        ctx.fill();
      });

      // Draw horizontal disk streaks
      diskParticles.forEach((p) => {
        p.x += p.speed;
        if (p.x > canvas.width) {
          p.x = 0;
          p.y = 240 + Math.random() * 20; // 240-260px
        }

        ctx.fillStyle = "rgba(255,140,0,0.6)";
        ctx.fillRect(p.x, p.y, 3, 1); // 1px x 3px (elongated, width 3, height 1)
      });

      animationFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    // 0s: fade in
    const t0 = setTimeout(() => setShowBlackHole(true), 0);

    // 100ms: camera approach
    const tScale = setTimeout(() => setScale(1.5), 100);

    // 8s: text line 1
    const t8 = setTimeout(() => setShowText1(true), 8000);

    // 10s: text line 2
    const t10 = setTimeout(() => setShowText2(true), 10000);

    // 12s: white flash
    const t12 = setTimeout(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 12000);

    // 13s: fade to black
    const t13 = setTimeout(() => setFadeBlack(true), 13000);

    // 14s: complete
    const t14 = setTimeout(() => onComplete(), 14000);

    return () => {
      clearTimeout(t0);
      clearTimeout(tScale);
      clearTimeout(t8);
      clearTimeout(t10);
      clearTimeout(t12);
      clearTimeout(t13);
      clearTimeout(t14);
    };
  }, [onComplete]);

  const absoluteCenter = {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  };

  const diskGradient = `linear-gradient(to right,
    transparent 0%,
    rgba(80,20,0,0.4) 8%,
    rgba(180,60,0,0.8) 18%,
    rgba(255,120,20,0.95) 28%,
    rgba(255,200,100,1) 38%,
    rgba(255,240,180,1) 50%,
    rgba(255,200,100,1) 62%,
    rgba(255,120,20,0.95) 72%,
    rgba(180,60,0,0.8) 82%,
    rgba(80,20,0,0.4) 92%,
    transparent 100%)`;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
        }

        @keyframes diskPulse {
          0%, 100% { opacity: 0.85; filter: blur(5px) brightness(1); }
          50% { opacity: 1; filter: blur(4px) brightness(1.15); }
        }
      `}</style>

      {/* Main container */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000008",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          opacity: showBlackHole ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          zIndex: 100,
        }}
      >
        {/* Layer 8: Screen Vignette */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,4,0.4) 60%, rgba(0,0,8,0.85) 80%, #000008 100%)",
            zIndex: 8,
          }}
        />

        {/* Black Hole Group */}
        <div
          style={{
            position: "relative",
            width: "500px",
            height: "500px",
            transform: `scale(${scale})`,
            transition: "transform 14s ease-in",
          }}
        >
          {/* Layer 1: Outer Nebula Glow */}
          <div
            style={{
              ...absoluteCenter,
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,100,0,0.06) 0%, rgba(255,60,0,0.04) 35%, rgba(150,40,0,0.02) 55%, transparent 70%)",
              zIndex: 1,
              animation: "pulse 4s ease-in-out infinite",
            }}
          />

          {/* Layer 2: Accretion Disk Back */}
          <div
            style={{
              ...absoluteCenter,
              width: "580px",
              height: "110px",
              borderRadius: "50%",
              background: diskGradient,
              filter: "blur(5px)",
              zIndex: 2,
              animation: "diskPulse 6s ease-in-out infinite",
            }}
          />

          {/* Layer 7: Star Particles (Canvas) */}
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            style={{
              ...absoluteCenter,
              zIndex: 3,
              pointerEvents: "none",
            }}
          />

          {/* Layer 6: Lens Distortion */}
          <div
            style={{
              ...absoluteCenter,
              width: "340px",
              height: "340px",
              borderRadius: "50%",
              background: "transparent",
              boxShadow: "0 0 60px 30px rgba(0,0,8,0.8)",
              zIndex: 4,
            }}
          />

          {/* Layer 3: Black Sphere */}
          <div
            style={{
              ...absoluteCenter,
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%, #050508, #000003)",
              boxShadow: "0 0 0 2px rgba(255,160,40,0.15), 0 0 40px rgba(0,0,0,1), 0 0 80px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,5,1)",
              zIndex: 5,
            }}
          />

          {/* Layer 4: Photon Ring */}
          <div
            style={{
              ...absoluteCenter,
              width: "290px",
              height: "290px",
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              boxShadow: "0 0 0 1.5px rgba(255,220,150,0.9), 0 0 0 3px rgba(255,160,40,0.4), 0 0 0 8px rgba(255,100,0,0.15), 0 0 20px rgba(255,120,0,0.3)",
              zIndex: 6,
            }}
          />

          {/* Layer 5: Disk Front Top Half */}
          <div
            style={{
              ...absoluteCenter,
              width: "580px",
              height: "110px",
              borderRadius: "50%",
              background: diskGradient,
              filter: "blur(3px)",
              opacity: 0.9,
              zIndex: 7,
              clipPath: "ellipse(290px 55px at 50% 0%)",
            }}
          />
        </div>

        {/* Text Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            width: "100%",
            textAlign: "center",
            zIndex: 6,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "36px",
              fontStyle: "italic",
              color: "rgba(255,200,100,0.8)",
              opacity: showText1 ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              textShadow: "-1px 0 rgba(255,0,0,0.4), 1px 0 rgba(0,100,255,0.4)",
            }}
          >
            Beyond known space...
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.5em",
              color: "rgba(255,140,0,0.6)",
              opacity: showText2 ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              marginTop: "16px",
            }}
          >
            APPROACHING SYSTEM X-07
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          data-cursor="hover"
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            zIndex: 10,
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(255,140,0,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255,140,0,0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,140,0,0.4)")}
        >
          SKIP ›
        </button>

        {/* White Flash Effect */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "white",
            zIndex: 20,
            pointerEvents: "none",
            opacity: flash ? 0.8 : 0,
            transition: flash ? "opacity 0.2s ease-out" : "opacity 0.4s ease-in",
          }}
        />

        {/* Fade to Black Effect */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#000008",
            zIndex: 30,
            pointerEvents: "none",
            opacity: fadeBlack ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>
    </>
  );
}
