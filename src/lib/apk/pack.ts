import JSZip from "jszip";
import type { ApkImage, ApkInfo, FitMode, ImageMatch, ProgressFn, UserImage } from "./types";
import { parseBinaryManifest } from "./axml";
import { apkImageFromEntry, isImagePath, renderReplacement } from "./images";
import { buildV1Entries, isSignaturePath, loadSigningMaterial, signApk } from "./sign";
import { yieldThread } from "@/lib/utils";

const STORE_EXT = /\.(so|arsc|mp3|ogg|wav|mp4)$/i;

export async function loadApk(
  file: File | Blob,
  fileName: string,
  onProgress?: ProgressFn,
): Promise<{ zip: JSZip; info: ApkInfo; images: ApkImage[] }> {
  onProgress?.(4, "Reading package");
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  onProgress?.(12, "Reading manifest");

  let info: ApkInfo = {
    fileName,
    size: file.size,
    isDemo: false,
  };
  const manifestEntry = zip.file("AndroidManifest.xml");
  if (manifestEntry) {
    try {
      const bytes = await manifestEntry.async("uint8array");
      const parsed = parseBinaryManifest(bytes);
      info = { ...info, ...parsed };
    } catch {
      // ignore
    }
  }

  const names = Object.keys(zip.files).filter((n) => {
    const e = zip.files[n];
    return e && !e.dir && isImagePath(n);
  });

  const images: ApkImage[] = [];
  let skipped = 0;
  for (let i = 0; i < names.length; i++) {
    const name = names[i]!;
    const entry = zip.files[name]!;
    try {
      const bytes = await entry.async("uint8array");
      const img = await apkImageFromEntry(name, bytes);
      if (img) images.push(img);
      else skipped++;
    } catch {
      skipped++;
    }
    if (i % 3 === 0) {
      const pct = 12 + Math.round((i / Math.max(1, names.length)) * 78);
      onProgress?.(pct, `Scanning images ${i + 1} / ${names.length}`);
      await yieldThread();
    }
  }

  onProgress?.(100, skipped ? `Found ${images.length} images` : `Found ${images.length} images`);
  return { zip, info, images };
}

export async function rebuildApk(
  zip: JSZip,
  matches: ImageMatch[],
  source: UserImage,
  fit: FitMode,
  onProgress?: ProgressFn,
): Promise<Uint8Array> {
  const selected = matches.filter((m) => m.selected);
  onProgress?.(4, `Resizing ${selected.length} replacements`);

  const replacements = new Map<string, Uint8Array>();
  for (let i = 0; i < selected.length; i++) {
    const m = selected[i]!;
    const bytes = await renderReplacement(source.bitmap, m.image, fit);
    replacements.set(m.image.path, bytes);
    if (i % 2 === 0) {
      onProgress?.(
        4 + Math.round((i / Math.max(1, selected.length)) * 36),
        `Fitting art ${i + 1} / ${selected.length}`,
      );
      await yieldThread();
    }
  }

  onProgress?.(42, "Packing files");
  const out = new JSZip();
  const packed: { name: string; data: Uint8Array }[] = [];

  const names = Object.keys(zip.files);
  for (let i = 0; i < names.length; i++) {
    const name = names[i]!;
    const entry = zip.files[name]!;
    if (entry.dir) continue;
    if (isSignaturePath(name)) continue;
    const data = replacements.get(name) ?? (await entry.async("uint8array"));
    packed.push({ name, data });
    const store = STORE_EXT.test(name);
    out.file(name, data, {
      compression: store ? "STORE" : "DEFLATE",
      compressionOptions: store ? undefined : { level: 6 },
      date: entry.date,
    });
  }

  onProgress?.(58, "Signing (v1)");
  const material = await loadSigningMaterial();
  const v1 = await buildV1Entries(packed, material);
  for (const f of v1) {
    out.file(f.name, f.data, { compression: "DEFLATE", compressionOptions: { level: 6 } });
  }

  onProgress?.(72, "Compressing package");
  const zipBytes = await out.generateAsync(
    { type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (meta) => {
      const pct = 72 + Math.round((meta.percent / 100) * 14);
      onProgress?.(pct, "Compressing package");
    },
  );

  onProgress?.(88, "Aligning and signing (v2)");
  const signed = await signApk(zipBytes, material);
  onProgress?.(100, "Package ready");
  return signed;
}

export function downloadApk(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([bytes as BlobPart], {
    type: "application/vnd.android.package-archive",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".apk") ? fileName.replace(/\.apk$/i, "-reskin.apk") : `${fileName}-reskin.apk`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function shareApk(bytes: Uint8Array, fileName: string): Promise<boolean> {
  const name = fileName.endsWith(".apk")
    ? fileName.replace(/\.apk$/i, "-reskin.apk")
    : `${fileName}-reskin.apk`;
  const file = new File([bytes as BlobPart], name, {
    type: "application/vnd.android.package-archive",
  });
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title?: string }) => Promise<void>;
  };
  if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && nav.share) {
    await nav.share({ files: [file], title: name });
    return true;
  }
  downloadApk(bytes, fileName);
  return false;
}
