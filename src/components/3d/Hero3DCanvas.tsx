"use client";
import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D extends Point3D {
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export default function Hero3DCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse / Pointer State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        isHovering = true;
        mouseX = (x - width / 2) / (width / 2);
        mouseY = (y - height / 2) / (height / 2);
        targetRotY = mouseX * 0.8;
        targetRotX = -mouseY * 0.8;
      } else {
        isHovering = false;
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // 3D Icosahedron Vertices
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio ~1.618
    const baseVertices: Point3D[] = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },

      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },

      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ];

    // Normalize base vertices to a sphere of radius 1
    const normalizedVertices = baseVertices.map((v) => {
      const len = Math.hypot(v.x, v.y, v.z);
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    });

    // Generate edges connecting closest vertices
    const edges: [number, number][] = [];
    for (let i = 0; i < normalizedVertices.length; i++) {
      for (let j = i + 1; j < normalizedVertices.length; j++) {
        const d = Math.hypot(
          normalizedVertices[i].x - normalizedVertices[j].x,
          normalizedVertices[i].y - normalizedVertices[j].y,
          normalizedVertices[i].z - normalizedVertices[j].z
        );
        // In normalized icosahedron, edge length is ~1.05
        if (d < 1.15) {
          edges.push([i, j]);
        }
      }
    }

    // 3D Floating Particles
    const PARTICLE_COUNT = 90;
    const particles: Particle3D[] = [];
    const colors = ["#8b7bff", "#38e1c6", "#ffffff", "#a594fd"];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute in a spherical cloud
      const theta = Math.random() * Math.PI * 2;
      const phiAngle = Math.acos(Math.random() * 2 - 1);
      const radius = 90 + Math.random() * 120;

      particles.push({
        x: radius * Math.sin(phiAngle) * Math.cos(theta),
        y: radius * Math.sin(phiAngle) * Math.sin(theta),
        z: radius * Math.cos(phiAngle),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // 3D Orbital Rings
    const ringSegments = 64;
    const makeRing = (radius: number, tiltX: number, tiltY: number): Point3D[] => {
      const ring: Point3D[] = [];
      for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        let z = 0;

        // Apply tilts
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;

        const cosY = Math.cos(tiltY);
        const sinY = Math.sin(tiltY);
        const x2 = x * cosY + z1 * sinY;
        const z2 = -x * sinY + z1 * cosY;

        ring.push({ x: x2, y: y1, z: z2 });
      }
      return ring;
    };

    // 3D Rotation Math
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
      };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos + p.z * sin,
        y: p.y,
        z: -p.x * sin + p.z * cos,
      };
    };

    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z,
      };
    };

    // Camera perspective projection
    const project = (p: Point3D, focalLength: number, cx: number, cy: number) => {
      const distance = focalLength + p.z;
      if (distance <= 10) return { x: cx, y: cy, scale: 0, depth: p.z };
      const scale = focalLength / distance;
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        scale,
        depth: p.z,
      };
    };

    let autoRotAngle = 0;
    let ringRotAngle = 0;

    // Render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const focalLength = 340;
      const modelScale = Math.min(width, height) * 0.28;

      // Inertia lerp
      if (!prefersReducedMotion) {
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        autoRotAngle += 0.008;
        ringRotAngle += 0.015;
      }

      const totalRotX = currentRotX + (isHovering ? 0 : Math.sin(autoRotAngle * 0.7) * 0.15);
      const totalRotY = currentRotY + autoRotAngle;

      // 1. Draw glowing background radial gradient centered on 3D object
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, modelScale * 1.8);
      bgGrad.addColorStop(0, "rgba(139, 123, 255, 0.18)");
      bgGrad.addColorStop(0.5, "rgba(56, 225, 198, 0.07)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Project and draw particles
      particles.forEach((p) => {
        // Slow particle drift
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.alpha += Math.sin(autoRotAngle * 5 * p.pulseSpeed) * 0.01;
        }

        // Keep inside bounds
        const dist = Math.hypot(p.x, p.y, p.z);
        if (dist > 220) {
          p.x *= 0.95;
          p.y *= 0.95;
          p.z *= 0.95;
        }

        // Apply scene rotation
        let rotP = rotateX(p, totalRotX * 0.5);
        rotP = rotateY(rotP, totalRotY * 0.5);

        const proj = project(rotP, focalLength, cx, cy);
        if (proj.scale > 0) {
          const alpha = Math.max(0.1, Math.min(0.9, p.alpha * proj.scale));
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // 3. Draw 3D Orbital Rings
      const rings = [
        { radius: modelScale * 1.35, tiltX: 0.8, tiltY: ringRotAngle * 0.8, color: "rgba(139, 123, 255, 0.45)" },
        { radius: modelScale * 1.55, tiltX: -0.6, tiltY: -ringRotAngle * 0.6, color: "rgba(56, 225, 198, 0.4)" },
      ];

      rings.forEach((r) => {
        const ringPoints = makeRing(r.radius, r.tiltX, r.tiltY);
        ctx.beginPath();
        let first = true;
        ringPoints.forEach((p) => {
          let rot = rotateX(p, totalRotX);
          rot = rotateY(rot, totalRotY);
          const proj = project(rot, focalLength, cx, cy);
          if (proj.scale > 0) {
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        });
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 4. Project 3D Icosahedron Vertices
      const projectedVertices = normalizedVertices.map((v) => {
        const scaled = {
          x: v.x * modelScale,
          y: v.y * modelScale,
          z: v.z * modelScale,
        };
        let rot = rotateX(scaled, totalRotX);
        rot = rotateY(rot, totalRotY);
        rot = rotateZ(rot, autoRotAngle * 0.3);
        return project(rot, focalLength, cx, cy);
      });

      // 5. Draw 3D Mesh Edges with depth sorting
      edges.forEach(([i, j]) => {
        const p1 = projectedVertices[i];
        const p2 = projectedVertices[j];

        if (p1.scale > 0 && p2.scale > 0) {
          const avgDepth = (p1.depth + p2.depth) / 2;
          const depthAlpha = Math.max(0.15, Math.min(0.9, (avgDepth + modelScale) / (modelScale * 2)));

          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `rgba(139, 123, 255, ${depthAlpha})`);
          grad.addColorStop(1, `rgba(56, 225, 198, ${depthAlpha})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(1, 1.8 * ((p1.scale + p2.scale) / 2));
          ctx.stroke();
        }
      });

      // 6. Draw 3D Vertices (Glowing Spheres & Halos)
      projectedVertices.forEach((p) => {
        if (p.scale > 0) {
          const depthAlpha = Math.max(0.3, Math.min(1, (p.depth + modelScale) / (modelScale * 2)));
          const radius = Math.max(2, 4.5 * p.scale);

          // Outer Glow
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3.5);
          glowGrad.addColorStop(0, `rgba(56, 225, 198, ${0.8 * depthAlpha})`);
          glowGrad.addColorStop(0.5, `rgba(139, 123, 255, ${0.4 * depthAlpha})`);
          glowGrad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Vertex Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = depthAlpha > 0.6 ? "#ffffff" : "#38e1c6";
          ctx.shadowColor = "#38e1c6";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 7. Center Radiant Core
      const coreRadius = Math.max(8, modelScale * 0.2);
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      coreGrad.addColorStop(0.3, "rgba(56, 225, 198, 0.7)");
      coreGrad.addColorStop(0.7, "rgba(139, 123, 255, 0.3)");
      coreGrad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "none" }}
        aria-label="Interactive 3D Geometric Polyhedron and Particle Visualizer"
        role="img"
      />
    </div>
  );
}
