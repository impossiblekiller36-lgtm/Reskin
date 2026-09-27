import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type JSZip from "jszip";
import {
  ArrowLeft,
  Check,
  Download,
  ImageIcon,
  Layers,
  LoaderCircle,
  Package,
  RefreshCw,
  Share2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/app/drop-zone";
import { ReskinMark } from "@/components/app/mark";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { cn, formatBytes } from "@/lib/utils";
import { buildDemoPack, replacePngBlob, sourcePngBlob } from "@/lib/apk/demo";
import { buildPreviews, loadUserImage, relatedMatches } from "@/lib/apk/images";
import { downloadApk, loadApk, rebuildApk, shareApk } from "@/lib/apk/pack";
import type { ApkImage, ApkInfo, FitMode, ImageMatch, UserImage } from "@/lib/apk/types";

type Phase = "idle" | "loading" | "ready" | "scanning" | "review" | "building" | "done";

const DEFAULT_THRESHOLD = 0.8;

function applyThreshold(matches: ImageMatch[], threshold: number): ImageMatch[] {
  const names = new Set(
    matches.filter((m) => m.score >= threshold).map((m) => m.image.baseName),
  );
  return matches.map((m) => ({
    ...m,
    selected: m.score >= threshold || names.has(m.image.baseName),
  }));
}

export function Workspace() {
  const zipRef = useRef<JSZip | null>(null);
  const autoScanRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [info, setInfo] = useState<ApkInfo | null>(null);
  const [images, setImages] = useState<ApkImage[]>([]);
  const [source, setSource] = useState<UserImage | null>(null);
  const [replacement, setReplacement] = useState<UserImage | null>(null);
  const [matches, setMatches] = useState<ImageMatch[]>([]);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [fit, setFit] = useState<FitMode>("cover");
  const [built, setBuilt] = useState<Uint8Array | null>(null);
  const [how, setHow] = useState(false);
  const [busyDemo, setBusyDemo] = useState(false);

  const reset = useCallback(() => {
    zipRef.current = null;
    autoScanRef.current = false;
    source?.bitmap.close();
    replacement?.bitmap.close();
    if (source?.objectUrl) URL.revokeObjectURL(source.objectUrl);
    if (replacement?.objectUrl) URL.revokeObjectURL(replacement.objectUrl);
    for (const m of matches) {
      if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
    }
    setPhase("idle");
    setProgress(0);
    setProgressLabel("");
    setInfo(null);
    setImages([]);
    setSource(null);
    setReplacement(null);
    setMatches([]);
    setThreshold(DEFAULT_THRESHOLD);
    setFit("cover");
    setBuilt(null);
  }, [matches, replacement, source]);

  useEffect(() => {
    return () => {
      source?.bitmap.close();
      replacement?.bitmap.close();
      if (source?.objectUrl) URL.revokeObjectURL(source.objectUrl);
      if (replacement?.objectUrl) URL.revokeObjectURL(replacement.objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unmount only
  }, []);

  const onProgress = useCallback((percent: number, label: string) => {
    setProgress(percent);
    setProgressLabel(label);
  }, []);

  const ingestApk = useCallback(
    async (file: File, demoInfo?: ApkInfo) => {
      setPhase("loading");
      setBuilt(null);
      try {
        const { zip, info: parsed, images: found } = await loadApk(file, file.name, onProgress);
        zipRef.current = zip;
        setInfo(demoInfo ?? parsed);
        setImages(found);
        setMatches([]);
        setPhase("ready");
        if (found.length === 0) {
          toast.error("No raster images found in this package.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not read that package. Use a valid .apk file.");
        setPhase("idle");
      }
    },
    [onProgress],
  );

  const onApkFile = useCallback(
    (file: File) => {
      void ingestApk(file);
    },
    [ingestApk],
  );

  const onSourceFile = useCallback(async (file: File) => {
    try {
      const img = await loadUserImage(file);
      setSource((prev) => {
        prev?.bitmap.close();
        if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
        return img;
      });
      setMatches([]);
      setBuilt(null);
    } catch {
      toast.error("Could not read that image.");
    }
  }, []);

  const onReplaceFile = useCallback(async (file: File) => {
    try {
      const img = await loadUserImage(file);
      setReplacement((prev) => {
        prev?.bitmap.close();
        if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
        return img;
      });
      setMatches([]);
      setBuilt(null);
    } catch {
      toast.error("Could not read that image.");
    }
  }, []);

  const runScan = useCallback(async () => {
    if (!source || !replacement) return;
    setPhase("scanning");
    setProgress(8);
    setProgressLabel("Comparing art");
    try {
      await new Promise((r) => setTimeout(r, 30));
      const raw = relatedMatches(source, images, threshold);
      setProgress(55);
      setProgressLabel("Fitting previews");
      const withPreview = await buildPreviews(replacement.bitmap, raw, fit, (done, total) => {
        setProgress(55 + Math.round((done / total) * 40));
        setProgressLabel(`Preview ${done} / ${total}`);
      });
      setMatches(applyThreshold(withPreview, threshold));
      setPhase("review");
      setProgress(100);
    } catch (err) {
      console.error(err);
      toast.error("Scan failed. Try a different source image.");
      setPhase("ready");
    }
  }, [fit, images, replacement, source, threshold]);

  const onThreshold = useCallback((value: number[]) => {
    const t = (value[0] ?? 68) / 100;
    setThreshold(t);
    setMatches((prev) => applyThreshold(prev, t));
  }, []);

  const onFit = useCallback(
    async (next: FitMode) => {
      setFit(next);
      if (!replacement || matches.length === 0) return;
      setProgressLabel("Refitting previews");
      const updated = await buildPreviews(replacement.bitmap, matches, next);
      setMatches(updated);
    },
    [matches, replacement],
  );

  const toggleMatch = useCallback((path: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.image.path === path ? { ...m, selected: !m.selected } : m)),
    );
  }, []);

  const selectedCount = useMemo(
    () => matches.filter((m) => m.selected).length,
    [matches],
  );

  const runBuild = useCallback(async () => {
    const zip = zipRef.current;
    if (!zip || !replacement || !info) return;
    if (selectedCount === 0) {
      toast.error("Select at least one image to replace.");
      return;
    }
    setPhase("building");
    setBuilt(null);
    try {
      const bytes = await rebuildApk(zip, matches, replacement, fit, onProgress);
      setBuilt(bytes);
      setPhase("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Rebuild failed. The package may be an unusual ZIP.");
      setPhase("review");
    }
  }, [fit, info, matches, onProgress, replacement, selectedCount]);

  const runDemo = useCallback(async () => {
    setBusyDemo(true);
    setPhase("loading");
    try {
      const demo = await buildDemoPack();
      const src = await sourcePngBlob(192);
      const rep = await replacePngBlob(512);
      await ingestApk(demo.file, demo.info);
      await onSourceFile(src);
      await onReplaceFile(rep);
      // scan after state commits — use the images from ingest via a microtask delay
      setTimeout(() => {
        void (async () => {
          /* scan is triggered below after images are in state */
        })();
      }, 0);
    } catch (err) {
      console.error(err);
      toast.error("Could not build the demo pack.");
      setPhase("idle");
    } finally {
      setBusyDemo(false);
    }
  }, [ingestApk, onReplaceFile, onSourceFile]);

  // Auto-scan when demo finishes loading both images
  const demoScanKey = info?.isDemo && source && replacement && phase === "ready" && images.length > 0;
  useEffect(() => {
    if (demoScanKey && !autoScanRef.current) {
      autoScanRef.current = true;
      void runScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoScanKey]);

  const onDownload = useCallback(() => {
    if (!built || !info) return;
    downloadApk(built, info.fileName);
  }, [built, info]);

  const onShare = useCallback(async () => {
    if (!built || !info) return;
    try {
      const shared = await shareApk(built, info.fileName);
      if (shared) toast.success("Shared — open the file to install.");
    } catch {
      downloadApk(built, info.fileName);
    }
  }, [built, info]);

  const canScan = Boolean(source && replacement && images.length && phase === "ready");
  const showWorkbench = phase !== "idle";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <ReskinMark className="size-7 text-accent" />
            <span className="font-display text-lg font-medium tracking-tight">Reskin</span>
          </div>
          <div className="flex items-center gap-1">
            {showWorkbench ? (
              <Button variant="ghost" size="sm" onClick={reset}>
                <RefreshCw />
                Start over
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setHow((v) => !v)}>
                How it works
              </Button>
            )}
          </div>
        </div>
      </header>

      {how ? <HowItWorks onClose={() => setHow(false)} /> : null}

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:pt-12">
        {!showWorkbench ? (
          <Landing onApk={onApkFile} onDemo={() => void runDemo()} busyDemo={busyDemo} />
        ) : null}

        {phase === "loading" || phase === "scanning" || phase === "building" ? (
          <BusyCard progress={progress} label={progressLabel} phase={phase} />
        ) : null}

        {showWorkbench && phase !== "loading" && info ? (
          <div className="stagger-in space-y-8">
            <PackageBar info={info} imageCount={images.length} />

            {phase === "ready" || phase === "review" || phase === "done" ? (
              <ImagePair
                source={source}
                replacement={replacement}
                onSource={onSourceFile}
                onReplace={onReplaceFile}
                disabled={phase === "done"}
              />
            ) : null}

            {phase === "ready" ? (
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  {images.length} images in the package. Scan finds every asset related to the first image, then fits the second to each size.
                </p>
                <Button size="lg" disabled={!canScan} onClick={() => void runScan()}>
                  Find related images
                </Button>
              </div>
            ) : null}

            {phase === "done" && built ? (
              <DoneCard
                info={info}
                bytes={built}
                replaced={selectedCount}
                onDownload={onDownload}
                onShare={() => void onShare()}
                onBack={() => setPhase("review")}
              />
            ) : null}

            {phase === "review" || phase === "done" ? (
              <MatchSection
                matches={matches}
                threshold={threshold}
                fit={fit}
                selectedCount={selectedCount}
                onThreshold={onThreshold}
                onFit={(f) => void onFit(f)}
                onToggle={toggleMatch}
                onSelectAll={(on) =>
                  setMatches((prev) => prev.map((m) => ({ ...m, selected: on })))
                }
              />
            ) : null}
          </div>
        ) : null}
      </main>

      {phase === "review" ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="tabular-nums text-fg">{selectedCount}</span> selected
            </p>
            <Button size="lg" onClick={() => void runBuild()} disabled={selectedCount === 0}>
              Rebuild APK
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Landing({
  onApk,
  onDemo,
  busyDemo,
}: {
  onApk: (file: File) => void;
  onDemo: () => void;
  busyDemo: boolean;
}) {
  return (
    <div className="stagger-in mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        APK image workshop
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-[-0.03em] text-fg sm:text-5xl">
        Print a new skin onto any APK.
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
        Drop a package and two pictures. Reskin finds every related image, resizes your art to match, rebuilds a signed APK, and lets you install it.
      </p>

      <div className="mt-10">
        <DropZone
          accept=".apk,application/vnd.android.package-archive,application/zip"
          label="Drop an APK, or browse"
          hint="Processed on this device — nothing is uploaded"
          icon={<Package className="size-8" strokeWidth={1.4} />}
          onFile={onApk}
          disabled={busyDemo}
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onDemo} disabled={busyDemo}>
          {busyDemo ? <LoaderCircle className="animate-spin" /> : <Layers />}
          Try the demo pack
        </Button>
        <p className="text-xs text-faint">Works in the browser. Install from Android after download.</p>
      </div>

      <ol className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          { n: "01", t: "Package", d: "Open any APK. We read every PNG, JPEG, and WebP inside." },
          { n: "02", t: "Match", d: "Your first image finds siblings — densities, pressed states, copies." },
          { n: "03", t: "Install", d: "The second image is fitted to each size. Rebuild, sign, install." },
        ].map((s) => (
          <li key={s.n} className="rounded-lg border border-border bg-surface p-5">
            <p className="font-mono text-xs text-faint">{s.n}</p>
            <h2 className="mt-2 font-display text-xl font-medium">{s.t}</h2>
            <p className="mt-2 text-sm text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HowItWorks({ onClose }: { onClose: () => void }) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-3xl space-y-3 text-sm text-muted">
            <p>
              An APK is a zip of an Android app. Icons and art live in several sizes (mdpi through xxxhdpi). Reskin hashes your first image, finds lookalikes plus the same filename in other density folders, then draws your second image into each slot — covering, containing, or stretching to the original pixels and format, including 9-patch borders.
            </p>
            <p>
              The rebuilt package is zipaligned and signed with a Reskin key stored in this browser, so Android will install it. Because the signature differs from the original, uninstall the store copy first. Apps that check Play Integrity or tamper detection may refuse to run after resigning.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function BusyCard({
  progress,
  label,
  phase,
}: {
  progress: number;
  label: string;
  phase: Phase;
}) {
  const title =
    phase === "loading" ? "Reading package" : phase === "scanning" ? "Matching images" : "Rebuilding APK";
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <LoaderCircle className="size-5 animate-spin text-accent" />
        <h2 className="font-display text-xl font-medium">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-muted">{label || "Working"}</p>
      <Progress className="mt-4" value={progress} />
      <p className="mt-2 text-right font-mono text-xs tabular-nums text-faint">{Math.round(progress)}%</p>
    </div>
  );
}

function PackageBar({ info, imageCount }: { info: ApkInfo; imageCount: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <Package className="size-4 text-muted" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{info.packageName ?? info.fileName}</p>
        <p className="truncate text-xs text-muted">
          {info.fileName}
          {info.versionName ? ` · v${info.versionName}` : ""}
          {` · ${formatBytes(info.size)}`}
        </p>
      </div>
      <Badge>{imageCount} images</Badge>
      {info.isDemo ? <Badge variant="accent">Demo</Badge> : null}
    </div>
  );
}

function ImagePair({
  source,
  replacement,
  onSource,
  onReplace,
  disabled,
}: {
  source: UserImage | null;
  replacement: UserImage | null;
  onSource: (file: File) => void;
  onReplace: (file: File) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">Find this</p>
        <DropZone
          accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp"
          label="Original art to search for"
          hint="A screenshot or export of the existing image"
          icon={<Upload className="size-7" strokeWidth={1.4} />}
          disabled={disabled}
          compact
          onFile={onSource}
          preview={
            source ? (
              <ImagePreview url={source.objectUrl} caption={`${source.width}×${source.height}`} />
            ) : undefined
          }
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">Replace with</p>
        <DropZone
          accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp"
          label="New art to stamp in"
          hint="Fitted to every related size and format"
          icon={<ImageIcon className="size-7" strokeWidth={1.4} />}
          disabled={disabled}
          compact
          onFile={onReplace}
          preview={
            replacement ? (
              <ImagePreview
                url={replacement.objectUrl}
                caption={`${replacement.width}×${replacement.height}`}
              />
            ) : undefined
          }
        />
      </div>
    </div>
  );
}

function ImagePreview({ url, caption }: { url: string; caption: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="checkerboard max-h-36 overflow-hidden rounded-md">
        <img
          src={url}
          alt=""
          className="max-h-36 max-w-full object-contain"
        />
      </div>
      <span className="font-mono text-xs text-muted">{caption}</span>
    </div>
  );
}

function MatchSection({
  matches,
  threshold,
  fit,
  selectedCount,
  onThreshold,
  onFit,
  onToggle,
  onSelectAll,
}: {
  matches: ImageMatch[];
  threshold: number;
  fit: FitMode;
  selectedCount: number;
  onThreshold: (v: number[]) => void;
  onFit: (f: FitMode) => void;
  onToggle: (path: string) => void;
  onSelectAll: (on: boolean) => void;
}) {
  const visible = matches.filter(
    (m) => m.selected || m.score >= threshold - 0.05,
  );
  const list = visible.length ? visible : matches.slice(0, 24);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium">Related images</h2>
          <p className="mt-1 text-sm text-muted">
            {selectedCount} of {matches.length} will be replaced
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onSelectAll(true)}>
            Select all
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSelectAll(false)}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted">Match tightness</span>
            <span className="tabular-nums text-fg">{Math.round(threshold * 100)}%</span>
          </div>
          <Slider
            min={40}
            max={95}
            step={1}
            value={[Math.round(threshold * 100)]}
            onValueChange={onThreshold}
          />
        </label>
        <div>
          <p className="mb-2 text-xs text-muted">Fit</p>
          <div className="flex rounded-md bg-inset p-1">
            {(["cover", "contain", "stretch"] as FitMode[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onFit(f)}
                className={cn(
                  "h-9 flex-1 rounded-sm text-xs font-medium capitalize transition-colors duration-150",
                  fit === f ? "bg-raised text-fg" : "text-muted hover:text-fg",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Nothing related enough. Drop a closer crop of the original, or loosen match tightness.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((m) => (
            <li key={m.image.path}>
              <MatchCard match={m} onToggle={() => onToggle(m.image.path)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MatchCard({ match, onToggle }: { match: ImageMatch; onToggle: () => void }) {
  const { image, score, selected, previewUrl, reasons } = match;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border bg-raised text-left transition-[border-color,box-shadow] duration-150",
        selected ? "border-accent/50 shadow-[var(--shadow-border)]" : "border-border",
      )}
    >
      <div className="grid grid-cols-2 gap-px bg-border">
        <Thumb src={image.thumbUrl} label="Original" />
        <Thumb src={previewUrl ?? image.thumbUrl} label="Replacement" />
      </div>
      <div className="flex items-start gap-3 p-3">
        <span
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border",
            selected ? "border-accent bg-accent text-accent-fg" : "border-border-strong",
          )}
        >
          {selected ? <Check className="size-3" /> : null}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs text-fg">{image.path}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="tabular-nums">{image.width}×{image.height}</span>
            {image.density ? <Badge>{image.density}</Badge> : null}
            {image.isNinePatch ? <Badge variant="warn">9-patch</Badge> : null}
            <Badge variant={score >= 0.8 ? "ok" : "default"}>{Math.round(score * 100)}%</Badge>
            {reasons.some((r) => r.kind === "density") ? (
              <Badge variant="accent">related</Badge>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function Thumb({ src, label }: { src: string; label: string }) {
  return (
    <div className="checkerboard relative flex h-32 items-center justify-center">
      <img src={src} alt="" className="max-h-32 max-w-full object-contain" />
      <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-bg/80 px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

function DoneCard({
  info,
  bytes,
  replaced,
  onDownload,
  onShare,
  onBack,
}: {
  info: ApkInfo;
  bytes: Uint8Array;
  replaced: number;
  onDownload: () => void;
  onShare: () => void;
  onBack: () => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ok">Ready to install</p>
      <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">Package rebuilt.</h2>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Replaced {replaced} image{replaced === 1 ? "" : "s"} in {info.fileName}. Signed with a Reskin key so Android will accept the install. Uninstall the original app first if it is already on the device.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={onDownload}>
          <Download />
          Download APK
        </Button>
        <Button size="lg" variant="secondary" onClick={onShare}>
          <Share2 />
          Share to install
        </Button>
        <Button size="lg" variant="ghost" onClick={onBack}>
          <ArrowLeft />
          Adjust matches
        </Button>
      </div>
      <p className="mt-5 text-xs text-faint">
        {formatBytes(bytes.byteLength)} · On Android, enable install from this browser if prompted. Play Integrity apps may refuse a resigned package.
      </p>
    </section>
  );
}
