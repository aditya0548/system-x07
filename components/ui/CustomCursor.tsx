"use client";

import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CursorProps {}

export default function CustomCursor({}: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);

  // Mouse position ref to hold raw coordinates
  const mousePos = useRef({ x: 0, y: 0 });
  // Ring position ref to animate lerp
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Dot follows mouse exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering an element with data-cursor="hover"
      const target = e.target as HTMLElement;
      if (target && target.closest('[data-cursor="hover"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      // Lerp logic for ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          width: 5,
          height: 5,
          backgroundColor: "#00ff88",
          borderRadius: "50%",
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          // Shift by -50% to center the dot on the cursor
          marginLeft: -2.5,
          marginTop: -2.5,
          transform: "translate3d(-100px, -100px, 0)", // Start offscreen
          transition: "transform 0s, scale 0.2s ease-out",
          scale: isHovering ? 0 : 1,
        }}
      />
      <div
        ref={ringRef}
        style={{
          width: 20,
          height: 20,
          border: "1px solid rgba(0, 255, 136, 0.4)",
          borderRadius: "50%",
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          // Shift by -50% to center the ring on the cursor
          marginLeft: -10,
          marginTop: -10,
          transform: "translate3d(-100px, -100px, 0)", // Start offscreen
          transition: "transform 0s, scale 0.2s ease-out",
          scale: isHovering ? 2.5 : 1,
        }}
      />
    </>
  );
}
