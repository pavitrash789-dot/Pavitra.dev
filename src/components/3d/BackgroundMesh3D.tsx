"use client";
import React, { useEffect, useRef } from "react";

interface WireframeMesh {
  type: "cube" | "octahedron" | "diamond";
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  size: number;
  color: string;
  alpha: number;
}

export default function BackgroundMesh3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Cube definition
    const cubeVertices = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
    ];
    const cubeEdges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Octahedron definition
    const octaVertices = [
      { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
      { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
    ];
    const octaEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // Create 10-14 subtle floating shapes
    const shapes: WireframeMesh[] = [];
    const types: ("cube" | "octahedron" | "diamond")[] = ["cube", "octahedron", "diamond"];
    const colors = ["#8b7bff", "#38e1c6", "#a594fd"];

    const count = 12;
    for (let i = 0; i < count; i++) {
      shapes.push({
        type: types[i % types.length],
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.008,
        vRotY: (Math.random() - 0.5) * 0.008,
        vRotZ: (Math.random() - 0.5) * 0.008,
        size: Math.random() * 22 + 18,
        color: colors[i % colors.length],
        alpha: Math.random() * 0.16 + 0.08,
      });
    }

    // Camera perspective projection
    const project = (p: { x: number; y: number; z: number }, cx: number, cy: number, fl: number) => {
      const distance = fl + p.z;
      if (distance <= 10) return { x: cx, y: cy, scale: 0 };
      const scale = fl / distance;
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        scale,
      };
    };

    const rotateX = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateY = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x * Math.cos(a) + p.z * Math.sin(a),
      y: p.y,
      z: -p.x * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateZ = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x * Math.cos(a) - p.y * Math.sin(a),
      y: p.x * Math.sin(a) + p.y * Math.cos(a),
      z: p.z,
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach((s) => {
        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          s.rotX += s.vRotX;
          s.rotY += s.vRotY;
          s.rotZ += s.vRotZ;

          // Wrap edges
          if (s.x < -100) s.x = width + 100;
          if (s.x > width + 100) s.x = -100;
          if (s.y < -100) s.y = height + 100;
          if (s.y > height + 100) s.y = -100;
        }

        const vertices = s.type === "octahedron" ? octaVertices : cubeVertices;
        const edges = s.type === "octahedron" ? octaEdges : cubeEdges;

        const transformed = vertices.map((v) => {
          let p = {
            x: v.x * s.size,
            y: v.y * s.size,
            z: v.z * s.size,
          };
          p = rotateX(p, s.rotX);
          p = rotateY(p, s.rotY);
          p = rotateZ(p, s.rotZ);
          p.z += s.z;
          return project(p, s.x, s.y, 450);
        });

        edges.forEach(([i, j]) => {
          const p1 = transformed[i];
          const p2 = transformed[j];
          if (p1.scale > 0 && p2.scale > 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = s.color;
            ctx.globalAlpha = s.alpha * Math.min(p1.scale, 1);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
