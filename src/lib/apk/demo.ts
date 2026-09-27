import JSZip from "jszip";
import type { ApkInfo } from "./types";

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { c, ctx };
}

function toPng(c: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    c.toBlob(
      async (b) => {
        if (!b) return reject(new Error("png"));
        resolve(new Uint8Array(await b.arrayBuffer()));
      },
      "image/png",
    );
  });
}

function toJpeg(c: HTMLCanvasElement, q = 0.88): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    c.toBlob(
      async (b) => {
        if (!b) return reject(new Error("jpeg"));
        resolve(new Uint8Array(await b.arrayBuffer()));
      },
      "image/jpeg",
      q,
    );
  });
}

/** Original mark: concentric rings + a diamond. */
export function drawSourceMark(ctx: CanvasRenderingContext2D, size: number, pressed = false): void {
  const s = size;
  ctx.clearRect(0, 0, s, s);
  const cx = s / 2;
  const cy = s / 2;
  ctx.fillStyle = pressed ? "#1a2218" : "#141811";
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = pressed ? "#9aaa88" : "#d7e0c8";
  ctx.lineWidth = Math.max(1.5, s * 0.045);
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = pressed ? "#b8c4a6" : "#eef0e8";
  ctx.beginPath();
  const d = s * 0.13;
  ctx.moveTo(cx, cy - d);
  ctx.lineTo(cx + d, cy);
  ctx.lineTo(cx, cy + d);
  ctx.lineTo(cx - d, cy);
  ctx.closePath();
  ctx.fill();
}

/** Replacement mark: a serif-like R monogram on a sage disc. */
export function drawReplaceMark(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size;
  ctx.clearRect(0, 0, s, s);
  const cx = s / 2;
  const cy = s / 2;
  ctx.fillStyle = "#d7e0c8";
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0c0d0b";
  ctx.font = `600 ${Math.round(s * 0.52)}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("R", cx, cy + s * 0.03);
}

function drawStripes(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = "#2a3024";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#6a735c";
  ctx.lineWidth = Math.max(2, size * 0.08);
  for (let i = -size; i < size * 2; i += size * 0.18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
}

function drawGear(ctx: CanvasRenderingContext2D, size: number): void {
  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#3d4436";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0c0d0b";
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#c5cbb8";
  ctx.lineWidth = Math.max(2, size * 0.07);
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.28, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLandscape(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#3a4a58");
  g.addColorStop(0.45, "#6b7c6a");
  g.addColorStop(1, "#2c3328");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1c2218";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  ctx.lineTo(w * 0.3, h * 0.4);
  ctx.lineTo(w * 0.55, h * 0.58);
  ctx.lineTo(w * 0.78, h * 0.36);
  ctx.lineTo(w, h * 0.52);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
}

async function pngAt(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size: number): Promise<Uint8Array> {
  const { c, ctx } = canvas(size);
  draw(ctx, size);
  return toPng(c);
}

export async function sourcePngBlob(size = 192): Promise<File> {
  const { c, ctx } = canvas(size);
  drawSourceMark(ctx, size);
  const blob = await new Promise<Blob>((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("png"))), "image/png");
  });
  return new File([blob], "source-mark.png", { type: "image/png" });
}

export async function replacePngBlob(size = 512): Promise<File> {
  const { c, ctx } = canvas(size);
  drawReplaceMark(ctx, size);
  const blob = await new Promise<Blob>((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("png"))), "image/png");
  });
  return new File([blob], "replacement-mark.png", { type: "image/png" });
}

export async function buildDemoPack(): Promise<{
  file: File;
  info: ApkInfo;
}> {
  const zip = new JSZip();
  const densities: { folder: string; size: number }[] = [
    { folder: "res/drawable-mdpi", size: 48 },
    { folder: "res/drawable-hdpi", size: 72 },
    { folder: "res/drawable-xhdpi", size: 96 },
    { folder: "res/drawable-xxhdpi", size: 144 },
    { folder: "res/drawable-xxxhdpi", size: 192 },
  ];

  for (const d of densities) {
    zip.file(`${d.folder}/badge.png`, await pngAt(drawSourceMark, d.size));
  }
  zip.file("res/drawable-xxhdpi/badge_pressed.png", await pngAt((ctx, s) => drawSourceMark(ctx, s, true), 144));
  zip.file("res/mipmap-xxhdpi/ic_launcher.png", await pngAt(drawSourceMark, 144));
  zip.file("res/drawable-hdpi/ic_settings.png", await pngAt(drawGear, 72));
  zip.file("res/drawable-xxhdpi/stripes.png", await pngAt(drawStripes, 128));

  const lc = document.createElement("canvas");
  lc.width = 320;
  lc.height = 180;
  const lctx = lc.getContext("2d");
  if (lctx) {
    drawLandscape(lctx, 320, 180);
    zip.file("assets/photos/landscape.jpg", await toJpeg(lc));
  }

  zip.file(
    "AndroidManifest.xml",
    `<?xml version="1.0" encoding="utf-8"?>
<manifest package="studio.reskin.demo" android:versionCode="1" android:versionName="1.0">
  <application android:label="Reskin Demo" />
</manifest>
`,
  );

  const bytes = await zip.generateAsync({ type: "uint8array" });
  const file = new File([bytes as BlobPart], "Reskin-Demo.apk", {
    type: "application/vnd.android.package-archive",
  });
  return {
    file,
    info: {
      fileName: file.name,
      size: file.size,
      packageName: "studio.reskin.demo",
      versionName: "1.0",
      versionCode: 1,
      isDemo: true,
    },
  };
}
