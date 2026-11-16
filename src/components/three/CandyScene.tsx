"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Hero 3D composition: glossy "candy" forms inspired by the striped
 * candy-ball in the Candies Studio mark. No external models or HDR files —
 * geometry and textures are generated at runtime (~0 KB of assets).
 */

const CANDY = ["#e8577d", "#f2a33a", "#f6d743", "#34b98a", "#5e79bb", "#6046aa"];

function useStripeTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 8;
    const ctx = c.getContext("2d")!;
    const seg = c.width / CANDY.length;
    CANDY.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(i * seg, 0, seg + 1, c.height);
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

type Item = {
  kind: "ball" | "sphere" | "torus" | "capsule";
  pos: [number, number, number];
  scale: number;
  color?: string;
  speed: number;
  phase: number;
  rot?: [number, number, number];
};

function Floater({ item, stripe, spread }: { item: Item; stripe: THREE.Texture | null; spread: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(item.pos[0] * spread, item.pos[1], item.pos[2]), [item.pos, spread]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * item.speed + item.phase;
    const m = ref.current;
    if (!m) return;
    m.position.set(base.x + Math.sin(t * 0.7) * 0.12, base.y + Math.sin(t) * 0.22, base.z + Math.cos(t * 0.6) * 0.1);
    m.rotation.x += 0.0016 * item.speed * 6;
    m.rotation.y += 0.0024 * item.speed * 6;
  });

  const geometry = useMemo(() => {
    switch (item.kind) {
      case "torus":
        return new THREE.TorusGeometry(0.62, 0.26, 48, 128);
      case "capsule":
        return new THREE.CapsuleGeometry(0.32, 0.7, 16, 48);
      default:
        return new THREE.SphereGeometry(1, 96, 96);
    }
  }, [item.kind]);

  return (
    <mesh ref={ref} geometry={geometry} scale={item.scale} rotation={item.rot ?? [0, 0, 0]} castShadow={false}>
      {item.kind === "ball" ? (
        <meshPhysicalMaterial
          map={stripe ?? undefined}
          roughness={0.18}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          sheen={0.4}
        />
      ) : (
        <meshPhysicalMaterial
          color={item.color}
          roughness={item.kind === "torus" ? 0.12 : 0.22}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={item.kind === "torus" ? 0.6 : 0.15}
          iridescenceIOR={1.4}
        />
      )}
    </mesh>
  );
}

function Rig({ children, compact }: { children: React.ReactNode; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const k = 1 - Math.pow(0.02, delta); // frame-rate independent damping
    g.rotation.y += (pointer.current.x * 0.35 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.2 - g.rotation.x) * k;
    g.position.y += (scroll * 1.6 - g.position.y) * k;
    // slow cinematic camera drift
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.12) * 0.35;
    state.camera.position.y = Math.cos(t * 0.1) * 0.2;
    state.camera.lookAt(compact ? 0 : 1.2, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

function Items({ items, stripe, compact }: { items: Item[]; stripe: THREE.Texture | null; compact: boolean }) {
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  // Layout is authored for ~16:10. Narrower desktop viewports pull objects inwards.
  const spread = compact ? 1 : Math.min(1.1, Math.max(0.7, aspect / 1.6));
  return (
    <>
      {items.map((it, i) => (
        <Floater key={i} item={it} stripe={stripe} spread={spread} />
      ))}
    </>
  );
}

export default function CandyScene({ compact = false, paused = false }: { compact?: boolean; paused?: boolean }) {
  const stripe = useStripeTexture();

  const items: Item[] = useMemo(() => {
    const desktop: Item[] = [
      { kind: "ball", pos: [3.5, -0.15, -0.4], scale: 1.4, speed: 0.55, phase: 0 },
      { kind: "torus", pos: [5.5, 1.9, -1.4], scale: 0.9, color: "#5e79bb", speed: 0.7, phase: 1.2, rot: [0.6, 0.3, 0] },
      { kind: "sphere", pos: [1.9, 2.25, -1.8], scale: 0.4, color: "#e8577d", speed: 0.8, phase: 2.1 },
      { kind: "capsule", pos: [6.1, -0.9, -1.4], scale: 0.75, color: "#f2a33a", speed: 0.65, phase: 0.6, rot: [0.3, 0, 0.9] },
      { kind: "sphere", pos: [6.9, -2.3, -2.2], scale: 0.3, color: "#34b98a", speed: 0.9, phase: 3.3 },
      { kind: "sphere", pos: [6.6, 0.2, -2.6], scale: 0.55, color: "#6046aa", speed: 0.5, phase: 4.2 },
      { kind: "torus", pos: [0.2, -1.4, -3.8], scale: 0.45, color: "#a9b8e0", speed: 0.6, phase: 5.1, rot: [1.1, 0.4, 0] },
      { kind: "sphere", pos: [4.4, 2.6, 0.6], scale: 0.2, color: "#f6d743", speed: 1.1, phase: 0.9 },
    ];
    const mobile: Item[] = [
      { kind: "ball", pos: [0.7, 0.0, -0.4], scale: 1.2, speed: 0.55, phase: 0 },
      { kind: "torus", pos: [-1.7, 1.25, -1.6], scale: 0.55, color: "#5e79bb", speed: 0.7, phase: 1.2, rot: [0.6, 0.3, 0] },
      { kind: "capsule", pos: [2.1, -1.35, -1.2], scale: 0.55, color: "#f2a33a", speed: 0.65, phase: 0.6, rot: [0.3, 0, 0.9] },
      { kind: "sphere", pos: [-1.5, -1.1, -0.6], scale: 0.28, color: "#e8577d", speed: 0.8, phase: 2.1 },
      { kind: "sphere", pos: [2.2, 1.6, -2], scale: 0.22, color: "#34b98a", speed: 0.9, phase: 3.3 },
    ];
    return compact ? mobile : desktop;
  }, [compact]);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, compact ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: compact ? 50 : 38 }}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 6, 4]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-6, -3, 2]} intensity={30} color="#5e79bb" />
      <pointLight position={[6, -4, 3]} intensity={18} color="#e8577d" />
      <Rig compact={compact}>
        <Items items={items} stripe={stripe} compact={compact} />
      </Rig>
    </Canvas>
  );
}
