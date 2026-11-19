"use client";
import React, { useRef, useState, useCallback, ReactNode } from "react";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
  onClick?: () => void;
}

export default function Tilt3D({
  children,
  className = "",
  maxAngle = 14,
  scale = 1.02,
  glare = true,
  perspective = 1000,
  onClick,
}: Tilt3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation angles
      const rotateX = ((y - centerY) / centerY) * -maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlarePos({ x: glareX, y: glareY, opacity: 0.22 });
      }
    },
    [maxAngle, scale, glare, perspective]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [perspective, glare]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: isHovered
          ? "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)"
          : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </div>

      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25) 0%, rgba(139, 123, 255, 0.12) 30%, transparent 65%)`,
            zIndex: 30,
          }}
        />
      )}
    </div>
  );
}
