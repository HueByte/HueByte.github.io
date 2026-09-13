import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

const WIDTH = 512;
const HEIGHT = 256;
const BLADES = 36;
const TIP_RADIUS = 3.2; // px, half-width of a blade at its tip

interface Point {
  x: number;
  y: number;
}

/**
 * A tuft of soft tapered blades, white on transparent, drawn once at startup. Only its alpha is
 * used: every grass card in the field shows this silhouette, so a few cards read as many blades.
 */
export function createTuftTexture(anisotropy: number): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // No 2D canvas: fall back to solid cards rather than an empty field.
    const solid = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    solid.needsUpdate = true;
    return solid;
  }

  const rand = mulberry32(4242);
  ctx.fillStyle = "#ffffff";
  // A little blur turns the hard silhouette into a soft one; with alpha-to-coverage that
  // softness survives onto the screen, which is most of what reads as "fluffy".
  if ("filter" in ctx) ctx.filter = "blur(1.8px)";
  for (let i = 0; i < BLADES; i++) drawBlade(ctx, rand);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = anisotropy;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/** One blade: a quadratic curve from the bottom edge, wide at the root, tapering to a point. */
function drawBlade(ctx: CanvasRenderingContext2D, rand: () => number): void {
  const root: Point = { x: WIDTH * (0.14 + rand() * 0.72), y: HEIGHT + 6 };
  const height = HEIGHT * (0.4 + rand() * 0.58);
  const lean = (rand() - 0.5) * WIDTH * 0.7;
  const tip: Point = { x: root.x + lean, y: root.y - height };
  // The blade rises fairly straight, then bends over toward its tip.
  const ctrl: Point = { x: root.x + lean * 0.15, y: root.y - height * 0.65 };
  const rootWidth = 7 + rand() * 8;

  const steps = 16;
  const left: Point[] = [];
  const right: Point[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const u = 1 - t;
    const px = u * u * root.x + 2 * u * t * ctrl.x + t * t * tip.x;
    const py = u * u * root.y + 2 * u * t * ctrl.y + t * t * tip.y;
    const tx = 2 * u * (ctrl.x - root.x) + 2 * t * (tip.x - ctrl.x);
    const ty = 2 * u * (ctrl.y - root.y) + 2 * t * (tip.y - ctrl.y);
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    // Wide at the root, still a few pixels wide at the tip: the blade ends in a soft rounded
    // nub rather than a needle.
    const w = rootWidth * Math.pow(u, 0.55) + TIP_RADIUS;
    left.push({ x: px + nx * w, y: py + ny * w });
    right.push({ x: px - nx * w, y: py - ny * w });
  }

  ctx.beginPath();
  ctx.moveTo(root.x, root.y);
  for (const p of left) ctx.lineTo(p.x, p.y);
  for (const p of right.slice().reverse()) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  ctx.fill();

  // Round the tip off.
  ctx.beginPath();
  ctx.arc(tip.x, tip.y, TIP_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}
