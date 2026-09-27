import type { ApkImage, FitMode, ImageFormat, ImageMatch, MatchReason, UserImage } from "./types";
import { yieldThread } from "@/lib/utils";

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp)$/i;
const SKIP_DIR = /^(META-INF\/|kotlin\/|okhttp3\/)/i;

export function isImagePath(path: string): boolean {
  if (SKIP_DIR.test(path)) return false;
  return IMAGE_EXT.test(path);
}

export function detectFormat(path: string, bytes: Uint8Array): ImageFormat {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  if (bytes.length >= 3 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "gif";
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "png") return "png";
  if (ext === "jpg" || ext === "jpeg") return "jpeg";
  if (ext === "webp") return "webp";
  if (ext === "gif") return "gif";
  return "unknown";
}

export function mimeFor(format: ImageFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

export function parseDensity(path: string): string | null {
  const m = path.match(
    /(?:drawable|mipmap)-([a-z0-9-]+)\//i,
  );
  if (m?.[1]) return m[1];
  if (/\/(?:drawable|mipmap)\//i.test(path)) return "default";
  return null;
}

export function baseNameOf(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.9\.png$/i, "").replace(/\.[^.]+$/, "");
}

let hashCanvas: HTMLCanvasElement | null = null;
function canvas(w: number, h: number): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error("Image processing needs a browser.");
  }
  if (!hashCanvas) hashCanvas = document.createElement("canvas");
  hashCanvas.width = w;
  hashCanvas.height = h;
  return hashCanvas;
}

function luma(data: Uint8ClampedArray, i: number): number {
  return 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
}

function sample(bitmap: ImageBitmap, w: number, h: number): ImageData {
  const c = canvas(w, h);
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

export function differenceHash(bitmap: ImageBitmap): bigint {
  const { data } = sample(bitmap, 9, 8);
  let hash = 0n;
  let bit = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = luma(data, (y * 9 + x) * 4);
      const right = luma(data, (y * 9 + x + 1) * 4);
      if (left > right) hash |= 1n << bit;
      bit += 1n;
    }
  }
  return hash;
}

export function averageHash(bitmap: ImageBitmap): bigint {
  const { data } = sample(bitmap, 8, 8);
  const vals: number[] = [];
  let sum = 0;
  for (let i = 0; i < 64; i++) {
    const v = luma(data, i * 4);
    vals.push(v);
    sum += v;
  }
  const avg = sum / 64;
  let hash = 0n;
  for (let i = 0; i < 64; i++) {
    if (vals[i]! >= avg) hash |= 1n << BigInt(i);
  }
  return hash;
}

export function colorHistogram(bitmap: ImageBitmap): Float32Array {
  const { data } = sample(bitmap, 32, 32);
  const bins = 8;
  const hist = new Float32Array(bins * 3);
  const n = data.length / 4;
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3]!;
    if (a < 16) continue;
    hist[Math.min(bins - 1, data[i * 4]! >> 5)] += 1;
    hist[bins + Math.min(bins - 1, data[i * 4 + 1]! >> 5)] += 1;
    hist[bins * 2 + Math.min(bins - 1, data[i * 4 + 2]! >> 5)] += 1;
  }
  let mag = 0;
  for (let i = 0; i < hist.length; i++) mag += hist[i]! * hist[i]!;
  mag = Math.sqrt(mag) || 1;
  for (let i = 0; i < hist.length; i++) hist[i]! /= mag;
  return hist;
}

export function hamming(a: bigint, b: bigint): number {
  let x = a ^ b;
  let n = 0;
  while (x) {
    x &= x - 1n;
    n++;
  }
  return n;
}

export function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i]! * b[i]!;
  return dot;
}

export function visualScore(src: UserImage, img: ApkImage): number {
  const d = 1 - hamming(src.dHash, img.dHash) / 64;
  const a = 1 - hamming(src.aHash, img.aHash) / 64;
  const h = (cosine(src.histogram, img.histogram) + 1) / 2;
  const arSrc = src.width / Math.max(1, src.height);
  const arImg = img.width / Math.max(1, img.height);
  const ar = 1 - Math.min(1, Math.abs(arSrc - arImg) / Math.max(arSrc, arImg));
  return d * 0.58 + a * 0.25 + h * 0.1 + ar * 0.07;
}

export async function decodeBitmap(bytes: Uint8Array, mime: string): Promise<ImageBitmap> {
  const blob = new Blob([bytes as BlobPart], { type: mime });
  return createImageBitmap(blob);
}

export function makeThumb(bitmap: ImageBitmap, max = 96): string {
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  return c.toDataURL("image/png");
}

export async function fingerprintBitmap(bitmap: ImageBitmap): Promise<{
  dHash: bigint;
  aHash: bigint;
  histogram: Float32Array;
}> {
  return {
    dHash: differenceHash(bitmap),
    aHash: averageHash(bitmap),
    histogram: colorHistogram(bitmap),
  };
}

export async function loadUserImage(file: File): Promise<UserImage> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    const fp = await fingerprintBitmap(bitmap);
    return {
      fileName: file.name,
      bitmap,
      width: bitmap.width,
      height: bitmap.height,
      objectUrl,
      ...fp,
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  }
}

export async function apkImageFromEntry(
  path: string,
  bytes: Uint8Array,
): Promise<ApkImage | null> {
  const format = detectFormat(path, bytes);
  if (format === "unknown") return null;
  try {
    const bitmap = await decodeBitmap(bytes, mimeFor(format));
    const fp = await fingerprintBitmap(bitmap);
    const thumbUrl = makeThumb(bitmap);
    const image: ApkImage = {
      path,
      bytes,
      width: bitmap.width,
      height: bitmap.height,
      format,
      isNinePatch: /\.9\.png$/i.test(path),
      density: parseDensity(path),
      baseName: baseNameOf(path),
      thumbUrl,
      ...fp,
    };
    bitmap.close();
    return image;
  } catch {
    return null;
  }
}

export function relatedMatches(
  source: UserImage,
  images: ApkImage[],
  threshold: number,
): ImageMatch[] {
  const scored: ImageMatch[] = images.map((image) => {
    const score = visualScore(source, image);
    const reasons: MatchReason[] = [
      { kind: "visual", label: `${Math.round(score * 100)}% visual match` },
    ];
    return {
      image,
      score,
      reasons,
      selected: score >= threshold,
      previewUrl: null,
    };
  });

  const strong = scored.filter((m) => m.score >= threshold);
  const names = new Set(strong.map((m) => m.image.baseName));

  for (const m of scored) {
    if (m.score >= threshold) continue;
    if (names.has(m.image.baseName)) {
      m.reasons.push({
        kind: "density",
        label: m.image.density
          ? `Same asset · ${m.image.density}`
          : "Same asset, other folder",
      });
      m.selected = true;
      // Keep the visual score but treat as related
      if (m.score < threshold) {
        m.score = Math.max(m.score, threshold * 0.92);
      }
    }
  }

  return scored
    .filter((m) => m.score >= 0.38 || names.has(m.image.baseName))
    .sort((a, b) => b.score - a.score);
}

function fitRect(
  srcW: number,
  srcH: number,
  destW: number,
  destH: number,
  fit: FitMode,
): { sx: number; sy: number; sw: number; sh: number; dx: number; dy: number; dw: number; dh: number } {
  if (fit === "stretch") {
    return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: destW, dh: destH };
  }
  const srcAr = srcW / srcH;
  const destAr = destW / destH;
  if (fit === "cover") {
    if (srcAr > destAr) {
      const sw = srcH * destAr;
      return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH, dx: 0, dy: 0, dw: destW, dh: destH };
    }
    const sh = srcW / destAr;
    return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh, dx: 0, dy: 0, dw: destW, dh: destH };
  }
  // contain
  if (srcAr > destAr) {
    const dw = destW;
    const dh = destW / srcAr;
    return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: (destH - dh) / 2, dw, dh };
  }
  const dh = destH;
  const dw = destH * srcAr;
  return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: (destW - dw) / 2, dy: 0, dw, dh };
}

function copyNinePatchBorder(
  original: ImageData,
  dest: ImageData,
): void {
  const sw = original.width;
  const sh = original.height;
  const dw = dest.width;
  const dh = dest.height;
  const s = original.data;
  const d = dest.data;

  const copyPx = (sx: number, sy: number, dx: number, dy: number) => {
    const si = (sy * sw + sx) * 4;
    const di = (dy * dw + dx) * 4;
    d[di] = s[si]!;
    d[di + 1] = s[si + 1]!;
    d[di + 2] = s[si + 2]!;
    d[di + 3] = s[si + 3]!;
  };

  // Corners
  copyPx(0, 0, 0, 0);
  copyPx(sw - 1, 0, dw - 1, 0);
  copyPx(0, sh - 1, 0, dh - 1);
  copyPx(sw - 1, sh - 1, dw - 1, dh - 1);

  // Top / bottom stretch markers — sample along original, scale to dest
  for (let x = 1; x < dw - 1; x++) {
    const sx = Math.min(sw - 2, Math.max(1, Math.round((x / (dw - 1)) * (sw - 1))));
    copyPx(sx, 0, x, 0);
    copyPx(sx, sh - 1, x, dh - 1);
  }
  for (let y = 1; y < dh - 1; y++) {
    const sy = Math.min(sh - 2, Math.max(1, Math.round((y / (dh - 1)) * (sh - 1))));
    copyPx(0, sy, 0, y);
    copyPx(sw - 1, sy, dw - 1, y);
  }
}

export async function renderReplacement(
  source: ImageBitmap,
  target: ApkImage,
  fit: FitMode,
): Promise<Uint8Array> {
  const w = Math.max(1, target.width);
  const h = Math.max(1, target.height);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  if (target.format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.clearRect(0, 0, w, h);
  }

  const pad = target.isNinePatch ? 1 : 0;
  const destW = Math.max(1, w - pad * 2);
  const destH = Math.max(1, h - pad * 2);
  const r = fitRect(source.width, source.height, destW, destH, fit);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    source,
    r.sx,
    r.sy,
    r.sw,
    r.sh,
    r.dx + pad,
    r.dy + pad,
    r.dw,
    r.dh,
  );

  if (target.isNinePatch) {
    try {
      const origBlob = new Blob([target.bytes as BlobPart], { type: "image/png" });
      const origBmp = await createImageBitmap(origBlob);
      const oc = document.createElement("canvas");
      oc.width = origBmp.width;
      oc.height = origBmp.height;
      const octx = oc.getContext("2d");
      if (octx) {
        octx.drawImage(origBmp, 0, 0);
        const origData = octx.getImageData(0, 0, oc.width, oc.height);
        const destData = ctx.getImageData(0, 0, w, h);
        copyNinePatchBorder(origData, destData);
        ctx.putImageData(destData, 0, 0);
      }
      origBmp.close();
    } catch {
      // Keep generated inner content without original markers
    }
  }

  const mime = mimeFor(target.format === "gif" ? "png" : target.format);
  const quality = target.format === "jpeg" || target.format === "webp" ? 0.92 : undefined;
  const blob = await new Promise<Blob>((resolve, reject) => {
    c.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
      mime,
      quality,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

export async function buildPreviews(
  source: ImageBitmap,
  matches: ImageMatch[],
  fit: FitMode,
  onProgress?: (done: number, total: number) => void,
): Promise<ImageMatch[]> {
  const out: ImageMatch[] = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]!;
    try {
      const bytes = await renderReplacement(source, m.image, fit);
      const blob = new Blob([bytes as BlobPart], { type: mimeFor(m.image.format) });
      if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
      out.push({ ...m, previewUrl: URL.createObjectURL(blob) });
    } catch {
      out.push(m);
    }
    if (i % 4 === 0) {
      onProgress?.(i + 1, matches.length);
      await yieldThread();
    }
  }
  return out;
}
