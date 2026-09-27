export type FitMode = "cover" | "contain" | "stretch";

export type ImageFormat = "png" | "jpeg" | "webp" | "gif" | "unknown";

export interface ApkInfo {
  fileName: string;
  size: number;
  packageName?: string;
  versionName?: string;
  versionCode?: number;
  isDemo: boolean;
}

export interface ApkImage {
  path: string;
  bytes: Uint8Array;
  width: number;
  height: number;
  format: ImageFormat;
  isNinePatch: boolean;
  dHash: bigint;
  aHash: bigint;
  histogram: Float32Array;
  thumbUrl: string;
  density: string | null;
  baseName: string;
}

export interface MatchReason {
  kind: "visual" | "density";
  label: string;
}

export interface ImageMatch {
  image: ApkImage;
  score: number;
  reasons: MatchReason[];
  selected: boolean;
  previewUrl: string | null;
}

export interface UserImage {
  fileName: string;
  bitmap: ImageBitmap;
  width: number;
  height: number;
  objectUrl: string;
  dHash: bigint;
  aHash: bigint;
  histogram: Float32Array;
}

export type ProgressFn = (percent: number, label: string) => void;
