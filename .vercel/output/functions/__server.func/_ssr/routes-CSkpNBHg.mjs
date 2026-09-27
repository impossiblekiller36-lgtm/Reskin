import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Package, c as Image, d as ArrowLeft, i as RefreshCw, l as Download, o as LoaderCircle, r as Share2, s as Layers, t as Upload, u as Check } from "../_libs/lucide-react.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as yieldThread, n as cn, r as formatBytes } from "./router-B-W_yqsc.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSkpNBHg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-raised text-muted",
		accent: "bg-accent/15 text-accent",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-raised text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "border border-border bg-transparent text-fg hover:bg-raised",
			ghost: "text-muted hover:bg-raised hover:text-fg",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function DropZone({ accept, label, hint, icon, preview, disabled, compact, onFile }) {
	const id = (0, import_react.useId)();
	const [over, setOver] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const take = (0, import_react.useCallback)((file) => {
		if (!file || disabled) return;
		onFile(file);
	}, [disabled, onFile]);
	const onDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;
		if (e.type === "dragenter" || e.type === "dragover") setOver(true);
		if (e.type === "dragleave") setOver(false);
	};
	const onDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setOver(false);
		take(e.dataTransfer.files?.[0]);
	};
	const onChange = (e) => {
		take(e.target.files?.[0]);
		e.target.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: mounted ? id : void 0,
		onDragEnter: onDrag,
		onDragOver: onDrag,
		onDragLeave: onDrag,
		onDrop,
		className: cn("group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition-[border-color,background-color,box-shadow] duration-200", compact ? "min-h-40 gap-2 p-4" : "min-h-56 gap-3 p-8", over ? "border-accent bg-accent/10 shadow-[var(--shadow-border-hover)]" : "border-border-strong bg-surface hover:border-muted hover:bg-raised", disabled && "pointer-events-none opacity-40"),
		children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: "file",
			accept,
			className: "sr-only",
			disabled,
			onChange
		}) : null, preview ? preview : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted transition-colors duration-200 group-hover:text-fg",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-fg",
				children: label
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			}) : null
		] })]
	});
}
function ReskinMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		fill: "none",
		"aria-hidden": "true",
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "10",
				width: "13",
				height: "13",
				rx: "3",
				stroke: "currentColor",
				strokeWidth: "1.6",
				opacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "7",
				width: "13",
				height: "13",
				rx: "3",
				stroke: "currentColor",
				strokeWidth: "1.6",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "4",
				width: "14",
				height: "14",
				rx: "3.2",
				fill: "currentColor"
			})
		]
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-raised", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full bg-accent transition-transform duration-300 ease-out",
		style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-raised",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-border-strong bg-fg shadow-sm transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none" })]
}));
Slider.displayName = Slider$1.displayName;
function canvas$1(size) {
	const c = document.createElement("canvas");
	c.width = size;
	c.height = size;
	const ctx = c.getContext("2d");
	if (!ctx) throw new Error("Canvas unsupported");
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	return {
		c,
		ctx
	};
}
function toPng(c) {
	return new Promise((resolve, reject) => {
		c.toBlob(async (b) => {
			if (!b) return reject(/* @__PURE__ */ new Error("png"));
			resolve(new Uint8Array(await b.arrayBuffer()));
		}, "image/png");
	});
}
function toJpeg(c, q = .88) {
	return new Promise((resolve, reject) => {
		c.toBlob(async (b) => {
			if (!b) return reject(/* @__PURE__ */ new Error("jpeg"));
			resolve(new Uint8Array(await b.arrayBuffer()));
		}, "image/jpeg", q);
	});
}
/** Original mark: concentric rings + a diamond. */
function drawSourceMark(ctx, size, pressed = false) {
	const s = size;
	ctx.clearRect(0, 0, s, s);
	const cx = s / 2;
	const cy = s / 2;
	ctx.fillStyle = pressed ? "#1a2218" : "#141811";
	ctx.beginPath();
	ctx.arc(cx, cy, s * .46, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = pressed ? "#9aaa88" : "#d7e0c8";
	ctx.lineWidth = Math.max(1.5, s * .045);
	ctx.beginPath();
	ctx.arc(cx, cy, s * .34, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, s * .22, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = pressed ? "#b8c4a6" : "#eef0e8";
	ctx.beginPath();
	const d = s * .13;
	ctx.moveTo(cx, cy - d);
	ctx.lineTo(cx + d, cy);
	ctx.lineTo(cx, cy + d);
	ctx.lineTo(cx - d, cy);
	ctx.closePath();
	ctx.fill();
}
/** Replacement mark: a serif-like R monogram on a sage disc. */
function drawReplaceMark(ctx, size) {
	const s = size;
	ctx.clearRect(0, 0, s, s);
	const cx = s / 2;
	const cy = s / 2;
	ctx.fillStyle = "#d7e0c8";
	ctx.beginPath();
	ctx.arc(cx, cy, s * .46, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#0c0d0b";
	ctx.font = `600 ${Math.round(s * .52)}px Georgia, serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("R", cx, cy + s * .03);
}
function drawStripes(ctx, size) {
	ctx.fillStyle = "#2a3024";
	ctx.fillRect(0, 0, size, size);
	ctx.strokeStyle = "#6a735c";
	ctx.lineWidth = Math.max(2, size * .08);
	for (let i = -size; i < size * 2; i += size * .18) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i + size, size);
		ctx.stroke();
	}
}
function drawGear(ctx, size) {
	const cx = size / 2;
	const cy = size / 2;
	ctx.clearRect(0, 0, size, size);
	ctx.fillStyle = "#3d4436";
	ctx.beginPath();
	ctx.arc(cx, cy, size * .42, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#0c0d0b";
	ctx.beginPath();
	ctx.arc(cx, cy, size * .16, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#c5cbb8";
	ctx.lineWidth = Math.max(2, size * .07);
	ctx.beginPath();
	ctx.arc(cx, cy, size * .28, 0, Math.PI * 2);
	ctx.stroke();
}
function drawLandscape(ctx, w, h) {
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, "#3a4a58");
	g.addColorStop(.45, "#6b7c6a");
	g.addColorStop(1, "#2c3328");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#1c2218";
	ctx.beginPath();
	ctx.moveTo(0, h * .62);
	ctx.lineTo(w * .3, h * .4);
	ctx.lineTo(w * .55, h * .58);
	ctx.lineTo(w * .78, h * .36);
	ctx.lineTo(w, h * .52);
	ctx.lineTo(w, h);
	ctx.lineTo(0, h);
	ctx.fill();
}
async function pngAt(draw, size) {
	const { c, ctx } = canvas$1(size);
	draw(ctx, size);
	return toPng(c);
}
async function sourcePngBlob(size = 192) {
	const { c, ctx } = canvas$1(size);
	drawSourceMark(ctx, size);
	const blob = await new Promise((resolve, reject) => {
		c.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("png")), "image/png");
	});
	return new File([blob], "source-mark.png", { type: "image/png" });
}
async function replacePngBlob(size = 512) {
	const { c, ctx } = canvas$1(size);
	drawReplaceMark(ctx, size);
	const blob = await new Promise((resolve, reject) => {
		c.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("png")), "image/png");
	});
	return new File([blob], "replacement-mark.png", { type: "image/png" });
}
async function buildDemoPack() {
	const zip = new import_lib.default();
	for (const d of [
		{
			folder: "res/drawable-mdpi",
			size: 48
		},
		{
			folder: "res/drawable-hdpi",
			size: 72
		},
		{
			folder: "res/drawable-xhdpi",
			size: 96
		},
		{
			folder: "res/drawable-xxhdpi",
			size: 144
		},
		{
			folder: "res/drawable-xxxhdpi",
			size: 192
		}
	]) zip.file(`${d.folder}/badge.png`, await pngAt(drawSourceMark, d.size));
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
	zip.file("AndroidManifest.xml", `<?xml version="1.0" encoding="utf-8"?>
<manifest package="studio.reskin.demo" android:versionCode="1" android:versionName="1.0">
  <application android:label="Reskin Demo" />
</manifest>
`);
	const bytes = await zip.generateAsync({ type: "uint8array" });
	const file = new File([bytes], "Reskin-Demo.apk", { type: "application/vnd.android.package-archive" });
	return {
		file,
		info: {
			fileName: file.name,
			size: file.size,
			packageName: "studio.reskin.demo",
			versionName: "1.0",
			versionCode: 1,
			isDemo: true
		}
	};
}
var IMAGE_EXT = /\.(png|jpe?g|webp|gif|bmp)$/i;
var SKIP_DIR = /^(META-INF\/|kotlin\/|okhttp3\/)/i;
function isImagePath(path) {
	if (SKIP_DIR.test(path)) return false;
	return IMAGE_EXT.test(path);
}
function detectFormat(path, bytes) {
	if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "png";
	if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216) return "jpeg";
	if (bytes.length >= 12 && bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) return "webp";
	if (bytes.length >= 3 && bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70) return "gif";
	const ext = path.split(".").pop()?.toLowerCase();
	if (ext === "png") return "png";
	if (ext === "jpg" || ext === "jpeg") return "jpeg";
	if (ext === "webp") return "webp";
	if (ext === "gif") return "gif";
	return "unknown";
}
function mimeFor(format) {
	switch (format) {
		case "png": return "image/png";
		case "jpeg": return "image/jpeg";
		case "webp": return "image/webp";
		case "gif": return "image/gif";
		default: return "application/octet-stream";
	}
}
function parseDensity(path) {
	const m = path.match(/(?:drawable|mipmap)-([a-z0-9-]+)\//i);
	if (m?.[1]) return m[1];
	if (/\/(?:drawable|mipmap)\//i.test(path)) return "default";
	return null;
}
function baseNameOf(path) {
	return (path.split("/").pop() ?? path).replace(/\.9\.png$/i, "").replace(/\.[^.]+$/, "");
}
var hashCanvas = null;
function canvas(w, h) {
	if (typeof document === "undefined") throw new Error("Image processing needs a browser.");
	if (!hashCanvas) hashCanvas = document.createElement("canvas");
	hashCanvas.width = w;
	hashCanvas.height = h;
	return hashCanvas;
}
function luma(data, i) {
	return .299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2];
}
function sample(bitmap, w, h) {
	const ctx = canvas(w, h).getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("Canvas unsupported");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, w, h);
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(bitmap, 0, 0, w, h);
	return ctx.getImageData(0, 0, w, h);
}
function differenceHash(bitmap) {
	const { data } = sample(bitmap, 9, 8);
	let hash = 0n;
	let bit = 0n;
	for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
		if (luma(data, (y * 9 + x) * 4) > luma(data, (y * 9 + x + 1) * 4)) hash |= 1n << bit;
		bit += 1n;
	}
	return hash;
}
function averageHash(bitmap) {
	const { data } = sample(bitmap, 8, 8);
	const vals = [];
	let sum = 0;
	for (let i = 0; i < 64; i++) {
		const v = luma(data, i * 4);
		vals.push(v);
		sum += v;
	}
	const avg = sum / 64;
	let hash = 0n;
	for (let i = 0; i < 64; i++) if (vals[i] >= avg) hash |= 1n << BigInt(i);
	return hash;
}
function colorHistogram(bitmap) {
	const { data } = sample(bitmap, 32, 32);
	const bins = 8;
	const hist = /* @__PURE__ */ new Float32Array(24);
	const n = data.length / 4;
	for (let i = 0; i < n; i++) {
		if (data[i * 4 + 3] < 16) continue;
		hist[Math.min(7, data[i * 4] >> 5)] += 1;
		hist[bins + Math.min(7, data[i * 4 + 1] >> 5)] += 1;
		hist[16 + Math.min(7, data[i * 4 + 2] >> 5)] += 1;
	}
	let mag = 0;
	for (let i = 0; i < hist.length; i++) mag += hist[i] * hist[i];
	mag = Math.sqrt(mag) || 1;
	for (let i = 0; i < hist.length; i++) hist[i] /= mag;
	return hist;
}
function hamming(a, b) {
	let x = a ^ b;
	let n = 0;
	while (x) {
		x &= x - 1n;
		n++;
	}
	return n;
}
function cosine(a, b) {
	let dot = 0;
	for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
	return dot;
}
function visualScore(src, img) {
	const d = 1 - hamming(src.dHash, img.dHash) / 64;
	const a = 1 - hamming(src.aHash, img.aHash) / 64;
	const h = (cosine(src.histogram, img.histogram) + 1) / 2;
	const arSrc = src.width / Math.max(1, src.height);
	const arImg = img.width / Math.max(1, img.height);
	const ar = 1 - Math.min(1, Math.abs(arSrc - arImg) / Math.max(arSrc, arImg));
	return d * .58 + a * .25 + h * .1 + ar * .07;
}
async function decodeBitmap(bytes, mime) {
	const blob = new Blob([bytes], { type: mime });
	return createImageBitmap(blob);
}
function makeThumb(bitmap, max = 96) {
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
async function fingerprintBitmap(bitmap) {
	return {
		dHash: differenceHash(bitmap),
		aHash: averageHash(bitmap),
		histogram: colorHistogram(bitmap)
	};
}
async function loadUserImage(file) {
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
			...fp
		};
	} catch (err) {
		URL.revokeObjectURL(objectUrl);
		throw err;
	}
}
async function apkImageFromEntry(path, bytes) {
	const format = detectFormat(path, bytes);
	if (format === "unknown") return null;
	try {
		const bitmap = await decodeBitmap(bytes, mimeFor(format));
		const fp = await fingerprintBitmap(bitmap);
		const thumbUrl = makeThumb(bitmap);
		const image = {
			path,
			bytes,
			width: bitmap.width,
			height: bitmap.height,
			format,
			isNinePatch: /\.9\.png$/i.test(path),
			density: parseDensity(path),
			baseName: baseNameOf(path),
			thumbUrl,
			...fp
		};
		bitmap.close();
		return image;
	} catch {
		return null;
	}
}
function relatedMatches(source, images, threshold) {
	const scored = images.map((image) => {
		const score = visualScore(source, image);
		return {
			image,
			score,
			reasons: [{
				kind: "visual",
				label: `${Math.round(score * 100)}% visual match`
			}],
			selected: score >= threshold,
			previewUrl: null
		};
	});
	const strong = scored.filter((m) => m.score >= threshold);
	const names = new Set(strong.map((m) => m.image.baseName));
	for (const m of scored) {
		if (m.score >= threshold) continue;
		if (names.has(m.image.baseName)) {
			m.reasons.push({
				kind: "density",
				label: m.image.density ? `Same asset · ${m.image.density}` : "Same asset, other folder"
			});
			m.selected = true;
			if (m.score < threshold) m.score = Math.max(m.score, threshold * .92);
		}
	}
	return scored.filter((m) => m.score >= .38 || names.has(m.image.baseName)).sort((a, b) => b.score - a.score);
}
function fitRect(srcW, srcH, destW, destH, fit) {
	if (fit === "stretch") return {
		sx: 0,
		sy: 0,
		sw: srcW,
		sh: srcH,
		dx: 0,
		dy: 0,
		dw: destW,
		dh: destH
	};
	const srcAr = srcW / srcH;
	const destAr = destW / destH;
	if (fit === "cover") {
		if (srcAr > destAr) {
			const sw = srcH * destAr;
			return {
				sx: (srcW - sw) / 2,
				sy: 0,
				sw,
				sh: srcH,
				dx: 0,
				dy: 0,
				dw: destW,
				dh: destH
			};
		}
		const sh = srcW / destAr;
		return {
			sx: 0,
			sy: (srcH - sh) / 2,
			sw: srcW,
			sh,
			dx: 0,
			dy: 0,
			dw: destW,
			dh: destH
		};
	}
	if (srcAr > destAr) {
		const dw = destW;
		const dh = destW / srcAr;
		return {
			sx: 0,
			sy: 0,
			sw: srcW,
			sh: srcH,
			dx: 0,
			dy: (destH - dh) / 2,
			dw,
			dh
		};
	}
	const dh = destH;
	const dw = destH * srcAr;
	return {
		sx: 0,
		sy: 0,
		sw: srcW,
		sh: srcH,
		dx: (destW - dw) / 2,
		dy: 0,
		dw,
		dh
	};
}
function copyNinePatchBorder(original, dest) {
	const sw = original.width;
	const sh = original.height;
	const dw = dest.width;
	const dh = dest.height;
	const s = original.data;
	const d = dest.data;
	const copyPx = (sx, sy, dx, dy) => {
		const si = (sy * sw + sx) * 4;
		const di = (dy * dw + dx) * 4;
		d[di] = s[si];
		d[di + 1] = s[si + 1];
		d[di + 2] = s[si + 2];
		d[di + 3] = s[si + 3];
	};
	copyPx(0, 0, 0, 0);
	copyPx(sw - 1, 0, dw - 1, 0);
	copyPx(0, sh - 1, 0, dh - 1);
	copyPx(sw - 1, sh - 1, dw - 1, dh - 1);
	for (let x = 1; x < dw - 1; x++) {
		const sx = Math.min(sw - 2, Math.max(1, Math.round(x / (dw - 1) * (sw - 1))));
		copyPx(sx, 0, x, 0);
		copyPx(sx, sh - 1, x, dh - 1);
	}
	for (let y = 1; y < dh - 1; y++) {
		const sy = Math.min(sh - 2, Math.max(1, Math.round(y / (dh - 1) * (sh - 1))));
		copyPx(0, sy, 0, y);
		copyPx(sw - 1, sy, dw - 1, y);
	}
}
async function renderReplacement(source, target, fit) {
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
	} else ctx.clearRect(0, 0, w, h);
	const pad = target.isNinePatch ? 1 : 0;
	const destW = Math.max(1, w - pad * 2);
	const destH = Math.max(1, h - pad * 2);
	const r = fitRect(source.width, source.height, destW, destH, fit);
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(source, r.sx, r.sy, r.sw, r.sh, r.dx + pad, r.dy + pad, r.dw, r.dh);
	if (target.isNinePatch) try {
		const origBlob = new Blob([target.bytes], { type: "image/png" });
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
	} catch {}
	const mime = mimeFor(target.format === "gif" ? "png" : target.format);
	const quality = target.format === "jpeg" || target.format === "webp" ? .92 : void 0;
	const blob = await new Promise((resolve, reject) => {
		c.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("Encode failed")), mime, quality);
	});
	return new Uint8Array(await blob.arrayBuffer());
}
async function buildPreviews(source, matches, fit, onProgress) {
	const out = [];
	for (let i = 0; i < matches.length; i++) {
		const m = matches[i];
		try {
			const bytes = await renderReplacement(source, m.image, fit);
			const blob = new Blob([bytes], { type: mimeFor(m.image.format) });
			if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
			out.push({
				...m,
				previewUrl: URL.createObjectURL(blob)
			});
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
var CHUNK_XML = 3;
var CHUNK_STRING_POOL = 1;
var CHUNK_START_ELEMENT = 258;
var UTF8_FLAG = 256;
function u16(view, offset) {
	return view.getUint16(offset, true);
}
function u32(view, offset) {
	return view.getUint32(offset, true);
}
function decodeUtf16(bytes, start, charCount) {
	const codes = [];
	for (let i = 0; i < charCount; i++) codes.push(bytes[start + i * 2] | bytes[start + i * 2 + 1] << 8);
	return String.fromCharCode(...codes);
}
function decodeUtf8(bytes, start, byteCount) {
	return new TextDecoder("utf-8").decode(bytes.subarray(start, start + byteCount));
}
function readStringPool(bytes, poolOff) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const stringCount = u32(view, poolOff + 8);
	const flags = u32(view, poolOff + 16);
	const stringsStart = u32(view, poolOff + 20);
	const utf8 = (flags & UTF8_FLAG) !== 0;
	const out = [];
	for (let i = 0; i < stringCount; i++) {
		const rel = u32(view, poolOff + 28 + i * 4);
		let p = poolOff + stringsStart + rel;
		try {
			if (utf8) {
				let charLen = bytes[p];
				p += 1;
				if (charLen & 128) {
					charLen = (charLen & 127) << 8 | bytes[p];
					p += 1;
				}
				let byteLen = bytes[p];
				p += 1;
				if (byteLen & 128) {
					byteLen = (byteLen & 127) << 8 | bytes[p];
					p += 1;
				}
				out.push(decodeUtf8(bytes, p, byteLen));
			} else {
				let charCount = bytes[p] | bytes[p + 1] << 8;
				p += 2;
				if (charCount & 32768) {
					charCount = (charCount & 32767) << 16 | (bytes[p] | bytes[p + 1] << 8);
					p += 2;
				}
				out.push(decodeUtf16(bytes, p, charCount));
			}
		} catch {
			out.push("");
		}
	}
	return out;
}
function parseBinaryManifest(data) {
	if (data.byteLength < 8) return {};
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const type = u16(view, 0);
	if (type !== CHUNK_XML && type !== CHUNK_STRING_POOL) {
		const text = new TextDecoder("utf-8", { fatal: false }).decode(data.subarray(0, Math.min(data.length, 4096)));
		if (text.includes("<manifest")) {
			const pkg = text.match(/package\s*=\s*"([^"]+)"/)?.[1];
			const vn = text.match(/versionName\s*=\s*"([^"]+)"/)?.[1];
			const vc = text.match(/versionCode\s*=\s*"([^"]+)"/)?.[1];
			return {
				packageName: pkg,
				versionName: vn,
				versionCode: vc ? Number(vc) : void 0
			};
		}
		return {};
	}
	let strings = [];
	let offset = 0;
	const fileSize = data.byteLength;
	const info = {};
	while (offset + 8 <= fileSize) {
		const chunkType = u16(view, offset);
		const headerSize = u16(view, offset + 2);
		const chunkSize = u32(view, offset + 4);
		if (chunkSize < 8 || offset + chunkSize > fileSize) break;
		if (chunkType === CHUNK_STRING_POOL) strings = readStringPool(data, offset);
		else if (chunkType === CHUNK_START_ELEMENT && headerSize >= 36) {
			const nameIdx = u32(view, offset + 20);
			const name = strings[nameIdx] ?? "";
			const attrStart = u16(view, offset + 24);
			const attrSize = u16(view, offset + 26);
			const attrCount = u16(view, offset + 28);
			if (name === "manifest") for (let i = 0; i < attrCount; i++) {
				const aOff = offset + attrStart + i * (attrSize || 20);
				if (aOff + 20 > offset + chunkSize) break;
				const attrNameIdx = u32(view, aOff + 4);
				const rawIdx = u32(view, aOff + 8);
				const dataType = data[aOff + 15];
				const attrData = u32(view, aOff + 16);
				const attrName = strings[attrNameIdx] ?? "";
				const raw = rawIdx !== 4294967295 ? strings[rawIdx] : void 0;
				if (attrName === "package" && raw) info.packageName = raw;
				if (attrName === "versionName" && raw) info.versionName = raw;
				if (attrName === "versionCode") {
					if (dataType === 16) info.versionCode = attrData;
					else if (raw) info.versionCode = Number(raw);
				}
			}
		}
		offset += chunkSize;
	}
	if (!info.packageName) {
		const pkg = strings.find((s) => /^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*){1,}$/.test(s) && !s.startsWith("android."));
		if (pkg) info.packageName = pkg;
	}
	return info;
}
/** Minimal DER encoder for X.509 certificates and PKCS#7 SignedData. */
function concat(...parts) {
	const len = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(len);
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}
function encodeLength(n) {
	if (n < 128) return Uint8Array.of(n);
	const bytes = [];
	let x = n;
	while (x > 0) {
		bytes.unshift(x & 255);
		x >>= 8;
	}
	return Uint8Array.of(128 | bytes.length, ...bytes);
}
function tlv(tag, contents) {
	return concat(Uint8Array.of(tag), encodeLength(contents.length), contents);
}
function seq(...parts) {
	return tlv(48, concat(...parts));
}
function setOf(...parts) {
	return tlv(49, concat(...parts));
}
function derNull() {
	return Uint8Array.of(5, 0);
}
function octetString(bytes) {
	return tlv(4, bytes);
}
function bitString(bytes, unused = 0) {
	return tlv(3, concat(Uint8Array.of(unused), bytes));
}
function integerBytes(bytes) {
	let b = bytes;
	while (b.length > 1 && b[0] === 0) b = b.subarray(1);
	if (b[0] & 128) b = concat(Uint8Array.of(0), b);
	return tlv(2, b);
}
function integerNum(n) {
	if (n === 0) return Uint8Array.of(2, 1, 0);
	const bytes = [];
	let x = n;
	while (x > 0) {
		bytes.unshift(x & 255);
		x >>= 8;
	}
	if (bytes[0] & 128) bytes.unshift(0);
	return tlv(2, Uint8Array.from(bytes));
}
function oid(str) {
	const parts = str.split(".").map(Number);
	const body = [40 * parts[0] + parts[1]];
	for (let i = 2; i < parts.length; i++) {
		let v = parts[i];
		const stack = [];
		stack.push(v & 127);
		v >>= 7;
		while (v > 0) {
			stack.push(128 | v & 127);
			v >>= 7;
		}
		for (let j = stack.length - 1; j >= 0; j--) body.push(stack[j]);
	}
	return tlv(6, Uint8Array.from(body));
}
function utf8(s) {
	return tlv(12, new TextEncoder().encode(s));
}
function utcTime(d) {
	const yy = String(d.getUTCFullYear()).slice(-2);
	const pad = (n) => String(n).padStart(2, "0");
	const s = `${yy}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
	return tlv(23, new TextEncoder().encode(s));
}
var OID = {
	sha256WithRSA: "1.2.840.113549.1.1.11",
	rsaEncryption: "1.2.840.113549.1.1.1",
	sha256: "2.16.840.1.101.3.4.2.1",
	commonName: "2.5.4.3",
	organization: "2.5.4.10",
	signedData: "1.2.840.113549.1.7.2",
	data: "1.2.840.113549.1.7.1",
	basicConstraints: "2.5.29.19",
	keyUsage: "2.5.29.15"
};
function algorithmIdentifier(oidStr, withNull = true) {
	return seq(oid(oidStr), ...withNull ? [derNull()] : []);
}
function nameCn(cn, org = "Reskin") {
	return seq(setOf(seq(oid(OID.commonName), utf8(cn))), setOf(seq(oid(OID.organization), utf8(org))));
}
function context(tag, contents, constructed = true) {
	return tlv((constructed ? 160 : 128) | tag, contents);
}
function toBase64(bytes) {
	let bin = "";
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	return btoa(bin);
}
function fromBase64(s) {
	const bin = atob(s);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}
async function sha256(data) {
	return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}
function wrap72(text) {
	const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const lines = [];
	for (const raw of normalized.split("\n")) {
		if (raw.length <= 72) {
			lines.push(raw);
			continue;
		}
		lines.push(raw.slice(0, 72));
		let rest = raw.slice(72);
		while (rest.length > 71) {
			lines.push(" " + rest.slice(0, 71));
			rest = rest.slice(71);
		}
		if (rest.length) lines.push(" " + rest);
	}
	return lines.join("\r\n");
}
/**
* Android zipalign: pad STORED (uncompressed) local-file extra fields so
* file data starts on an alignment boundary. `.so` uses 4096, everything
* else 4.
*/
var LOCAL_SIG = 67324752;
var CD_SIG = 33639248;
var EOCD_SIG = 101010256;
function alignmentFor(name, method) {
	if (method !== 0) return 1;
	if (name.endsWith(".so")) return 4096;
	return 4;
}
function findEocd$1(buf, view) {
	for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) {
		if (view.getUint32(i, true) !== EOCD_SIG) continue;
		const comment = view.getUint16(i + 20, true);
		if (i + 22 + comment === buf.length) return i;
	}
	throw new Error("Invalid ZIP: end record missing");
}
function zipalign(input) {
	const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
	const eocd = findEocd$1(input, view);
	const count = view.getUint16(eocd + 10, true);
	const cdSize = view.getUint32(eocd + 12, true);
	const cdOffset = view.getUint32(eocd + 16, true);
	if (view.getUint32(eocd + 4, true) !== 0 || view.getUint16(eocd + 8, true) !== count) return input;
	const decoder = new TextDecoder("utf-8");
	const entries = [];
	let p = cdOffset;
	for (let i = 0; i < count; i++) {
		if (p + 46 > input.length || view.getUint32(p, true) !== CD_SIG) return input;
		const nameLen = view.getUint16(p + 28, true);
		const extraLen = view.getUint16(p + 30, true);
		const commentLen = view.getUint16(p + 32, true);
		const localOffset = view.getUint32(p + 42, true);
		const name = decoder.decode(input.subarray(p + 46, p + 46 + nameLen));
		const size = 46 + nameLen + extraLen + commentLen;
		entries.push({
			header: input.subarray(p, p + size),
			name,
			localOffset
		});
		p += size;
	}
	if (p !== cdOffset + cdSize) return input;
	const localChunks = [];
	const newOffsets = [];
	let cursor = 0;
	for (const entry of entries) {
		const lo = entry.localOffset;
		if (view.getUint32(lo, true) !== LOCAL_SIG) return input;
		const method = view.getUint16(lo + 8, true);
		const nameLen = view.getUint16(lo + 26, true);
		const extraLen = view.getUint16(lo + 28, true);
		const compSize = view.getUint32(lo + 18, true);
		const dataStart = lo + 30 + nameLen + extraLen;
		const headerWithoutExtra = input.subarray(lo, lo + 30 + nameLen);
		const extra = input.subarray(lo + 30 + nameLen, lo + 30 + nameLen + extraLen);
		const data = input.subarray(dataStart, dataStart + compSize);
		const align = alignmentFor(entry.name, method);
		const headerLen = 30 + nameLen;
		const extraSoFar = extra.length;
		let pad = 0;
		if (align > 1) {
			const mis = (cursor + headerLen + extraSoFar) % align;
			if (mis !== 0) pad = align - mis;
		}
		const newExtra = new Uint8Array(extra.length + pad);
		newExtra.set(extra);
		const local = new Uint8Array(headerLen + newExtra.length + data.length);
		local.set(headerWithoutExtra, 0);
		new DataView(local.buffer).setUint16(28, newExtra.length, true);
		local.set(newExtra, headerLen);
		local.set(data, headerLen + newExtra.length);
		newOffsets.push(cursor);
		localChunks.push(local);
		cursor += local.length;
	}
	const cdChunks = [];
	let newCdSize = 0;
	for (let i = 0; i < entries.length; i++) {
		const src = entries[i].header;
		const copy = new Uint8Array(src);
		new DataView(copy.buffer).setUint32(42, newOffsets[i], true);
		cdChunks.push(copy);
		newCdSize += copy.length;
	}
	const eocdBytes = input.slice(eocd);
	const out = new Uint8Array(cursor + newCdSize + eocdBytes.length);
	let o = 0;
	for (const c of localChunks) {
		out.set(c, o);
		o += c.length;
	}
	const newCdOffset = o;
	for (const c of cdChunks) {
		out.set(c, o);
		o += c.length;
	}
	out.set(eocdBytes, o);
	const ov = new DataView(out.buffer);
	ov.setUint32(o + 12, newCdSize, true);
	ov.setUint32(o + 16, newCdOffset, true);
	return out;
}
var KEY_STORAGE = "reskin.signing-key.v1";
var SIG_ALG_V2 = 259;
var V2_BLOCK_ID = 1896449818;
var MAGIC = new TextEncoder().encode("APK Sig Block 42");
var CHUNK = 1048576;
var rsaParams = {
	name: "RSASSA-PKCS1-v1_5",
	hash: "SHA-256"
};
async function generateCert(publicKey, privateKey) {
	const spki = new Uint8Array(await crypto.subtle.exportKey("spki", publicKey));
	const serial = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(8));
	serial[0] = serial[0] & 127;
	const notBefore = new Date(Date.UTC(2020, 0, 1));
	const notAfter = new Date(Date.UTC(2049, 11, 31, 23, 59, 59));
	const subject = nameCn("Reskin", "Reskin");
	const tbs = seq(context(0, integerNum(2)), integerBytes(serial), algorithmIdentifier(OID.sha256WithRSA), subject, seq(utcTime(notBefore), utcTime(notAfter)), subject, spki);
	const signature = new Uint8Array(await crypto.subtle.sign(rsaParams, privateKey, tbs));
	return {
		certDer: seq(tbs, algorithmIdentifier(OID.sha256WithRSA), bitString(signature)),
		spki
	};
}
async function loadSigningMaterial() {
	try {
		const raw = localStorage.getItem(KEY_STORAGE);
		if (raw) {
			const stored = JSON.parse(raw);
			const pkcs8 = fromBase64(stored.pkcs8);
			const spki = fromBase64(stored.spki);
			const certDer = fromBase64(stored.cert);
			return {
				privateKey: await crypto.subtle.importKey("pkcs8", pkcs8, rsaParams, true, ["sign"]),
				publicKey: await crypto.subtle.importKey("spki", spki, rsaParams, true, ["verify"]),
				certDer,
				spki
			};
		}
	} catch {}
	const pair = await crypto.subtle.generateKey({
		name: "RSASSA-PKCS1-v1_5",
		modulusLength: 2048,
		publicExponent: new Uint8Array([
			1,
			0,
			1
		]),
		hash: "SHA-256"
	}, true, ["sign", "verify"]);
	const { certDer, spki } = await generateCert(pair.publicKey, pair.privateKey);
	const stored = {
		pkcs8: toBase64(new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey))),
		spki: toBase64(spki),
		cert: toBase64(certDer)
	};
	try {
		localStorage.setItem(KEY_STORAGE, JSON.stringify(stored));
	} catch {}
	return {
		privateKey: pair.privateKey,
		publicKey: pair.publicKey,
		certDer,
		spki
	};
}
function isSignaturePath(name) {
	const n = name.replace(/\\/g, "/");
	if (!n.toUpperCase().startsWith("META-INF/")) return false;
	return /\/MANIFEST\.MF$/i.test(n) || /\.(SF|RSA|DSA|EC)$/i.test(n) || /\/SIG-/i.test(n);
}
function manifestSection(name, digestB64) {
	return wrap72(`Name: ${name}\r\nSHA-256-Digest: ${digestB64}\r\n\r\n`);
}
async function buildV1Entries(files, material) {
	const encoder = new TextEncoder();
	const entries = files.filter((f) => !isSignaturePath(f.name) && !f.name.endsWith("/"));
	let manifest = "Manifest-Version: 1.0\r\nCreated-By: Reskin\r\n\r\n";
	const sections = [];
	for (const file of entries) {
		const digest = toBase64(await sha256(file.data));
		const section = manifestSection(file.name, digest);
		sections.push({
			name: file.name,
			section
		});
		manifest += section;
	}
	const manifestBytes = encoder.encode(manifest);
	let sf = wrap72(`Signature-Version: 1.0\r\nCreated-By: Reskin\r\nSHA-256-Digest-Manifest: ${toBase64(await sha256(manifestBytes))}\r\n\r\n`);
	for (const s of sections) {
		const secDigest = toBase64(await sha256(encoder.encode(s.section)));
		sf += wrap72(`Name: ${s.name}\r\nSHA-256-Digest: ${secDigest}\r\n\r\n`);
	}
	const sfBytes = encoder.encode(sf);
	const signature = new Uint8Array(await crypto.subtle.sign(rsaParams, material.privateKey, sfBytes));
	const pkcs7 = seq(oid(OID.signedData), context(0, seq(integerNum(1), setOf(algorithmIdentifier(OID.sha256)), seq(oid(OID.data)), context(0, material.certDer), setOf(seq(integerNum(1), seq(nameCn("Reskin", "Reskin"), integerBytes(readSerial(material.certDer))), algorithmIdentifier(OID.sha256), algorithmIdentifier(OID.sha256WithRSA), octetString(signature))))));
	return [
		{
			name: "META-INF/MANIFEST.MF",
			data: manifestBytes
		},
		{
			name: "META-INF/CERT.SF",
			data: sfBytes
		},
		{
			name: "META-INF/CERT.RSA",
			data: pkcs7
		}
	];
}
function readSerial(cert) {
	let i = 0;
	const expect = (tag) => {
		if (cert[i] !== tag) throw new Error("Cert parse");
		i++;
		const { len, header } = readLen(cert, i);
		i += header;
		return len;
	};
	expect(48);
	expect(48);
	if (cert[i] === 160) {
		i++;
		const { len, header } = readLen(cert, i);
		i += header + len;
	}
	if (cert[i] !== 2) throw new Error("Serial missing");
	i++;
	const { len, header } = readLen(cert, i);
	i += header;
	return cert.subarray(i, i + len);
}
function readLen(buf, i) {
	const b = buf[i];
	if (b < 128) return {
		len: b,
		header: 1
	};
	const n = b & 127;
	let len = 0;
	for (let k = 0; k < n; k++) len = len << 8 | buf[i + 1 + k];
	return {
		len,
		header: 1 + n
	};
}
function u32le(n) {
	const b = /* @__PURE__ */ new Uint8Array(4);
	new DataView(b.buffer).setUint32(0, n >>> 0, true);
	return b;
}
function u64le(n) {
	const b = /* @__PURE__ */ new Uint8Array(8);
	new DataView(b.buffer).setBigUint64(0, BigInt(n), true);
	return b;
}
function lp(data) {
	return concat(u32le(data.length), data);
}
function findEocd(apk) {
	const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength);
	for (let i = apk.length - 22; i >= Math.max(0, apk.length - 22 - 65535); i--) {
		if (view.getUint32(i, true) !== 101010256) continue;
		const commentLen = view.getUint16(i + 20, true);
		if (i + 22 + commentLen !== apk.length) continue;
		return {
			offset: i,
			cdSize: view.getUint32(i + 12, true),
			cdOffset: view.getUint32(i + 16, true)
		};
	}
	throw new Error("Invalid APK: ZIP end record not found");
}
async function chunkDigests(parts) {
	const out = [];
	for (const part of parts) for (let off = 0; off < part.length; off += CHUNK) {
		const slice = part.subarray(off, Math.min(part.length, off + CHUNK));
		const prefixed = concat(Uint8Array.of(165), u32le(slice.length), slice);
		out.push(await sha256(prefixed));
	}
	return out;
}
async function signV2(apk, material) {
	const { offset: eocdOffset, cdOffset, cdSize } = findEocd(apk);
	const contents = apk.subarray(0, cdOffset);
	const cd = apk.subarray(cdOffset, cdOffset + cdSize);
	const eocd = apk.slice(eocdOffset);
	const chunks = await chunkDigests([
		contents,
		cd,
		eocd
	]);
	const digest = await sha256(concat(Uint8Array.of(90), u32le(chunks.length), ...chunks));
	const signedData = concat(lp(lp(concat(u32le(SIG_ALG_V2), lp(digest)))), lp(lp(material.certDer)), u32le(0));
	const signature = new Uint8Array(await crypto.subtle.sign(rsaParams, material.privateKey, signedData));
	const signatures = lp(lp(concat(u32le(SIG_ALG_V2), lp(signature))));
	const publicKey = lp(material.spki);
	const pairValue = lp(lp(concat(lp(signedData), signatures, publicKey)));
	const pair = concat(u64le(4 + pairValue.length), u32le(V2_BLOCK_ID), pairValue);
	const blockSizeMinus8 = 8 + pair.length + 8 + 16;
	const block = concat(u64le(blockSizeMinus8), pair, u64le(blockSizeMinus8), MAGIC);
	const out = new Uint8Array(contents.length + block.length + cd.length + eocd.length);
	out.set(contents, 0);
	out.set(block, contents.length);
	out.set(cd, contents.length + block.length);
	const newEocdOff = contents.length + block.length + cd.length;
	out.set(eocd, newEocdOff);
	new DataView(out.buffer).setUint32(newEocdOff + 16, contents.length + block.length, true);
	return out;
}
async function signApk(zipBytes, material) {
	return signV2(zipalign(zipBytes), material);
}
var STORE_EXT = /\.(so|arsc|mp3|ogg|wav|mp4)$/i;
async function loadApk(file, fileName, onProgress) {
	onProgress?.(4, "Reading package");
	const buf = await file.arrayBuffer();
	const zip = await import_lib.default.loadAsync(buf);
	onProgress?.(12, "Reading manifest");
	let info = {
		fileName,
		size: file.size,
		isDemo: false
	};
	const manifestEntry = zip.file("AndroidManifest.xml");
	if (manifestEntry) try {
		const parsed = parseBinaryManifest(await manifestEntry.async("uint8array"));
		info = {
			...info,
			...parsed
		};
	} catch {}
	const names = Object.keys(zip.files).filter((n) => {
		const e = zip.files[n];
		return e && !e.dir && isImagePath(n);
	});
	const images = [];
	let skipped = 0;
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const entry = zip.files[name];
		try {
			const img = await apkImageFromEntry(name, await entry.async("uint8array"));
			if (img) images.push(img);
			else skipped++;
		} catch {
			skipped++;
		}
		if (i % 3 === 0) {
			const pct = 12 + Math.round(i / Math.max(1, names.length) * 78);
			onProgress?.(pct, `Scanning images ${i + 1} / ${names.length}`);
			await yieldThread();
		}
	}
	onProgress?.(100, skipped ? `Found ${images.length} images` : `Found ${images.length} images`);
	return {
		zip,
		info,
		images
	};
}
async function rebuildApk(zip, matches, source, fit, onProgress) {
	const selected = matches.filter((m) => m.selected);
	onProgress?.(4, `Resizing ${selected.length} replacements`);
	const replacements = /* @__PURE__ */ new Map();
	for (let i = 0; i < selected.length; i++) {
		const m = selected[i];
		const bytes = await renderReplacement(source.bitmap, m.image, fit);
		replacements.set(m.image.path, bytes);
		if (i % 2 === 0) {
			onProgress?.(4 + Math.round(i / Math.max(1, selected.length) * 36), `Fitting art ${i + 1} / ${selected.length}`);
			await yieldThread();
		}
	}
	onProgress?.(42, "Packing files");
	const out = new import_lib.default();
	const packed = [];
	const names = Object.keys(zip.files);
	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const entry = zip.files[name];
		if (entry.dir) continue;
		if (isSignaturePath(name)) continue;
		const data = replacements.get(name) ?? await entry.async("uint8array");
		packed.push({
			name,
			data
		});
		const store = STORE_EXT.test(name);
		out.file(name, data, {
			compression: store ? "STORE" : "DEFLATE",
			compressionOptions: store ? void 0 : { level: 6 },
			date: entry.date
		});
	}
	onProgress?.(58, "Signing (v1)");
	const material = await loadSigningMaterial();
	const v1 = await buildV1Entries(packed, material);
	for (const f of v1) out.file(f.name, f.data, {
		compression: "DEFLATE",
		compressionOptions: { level: 6 }
	});
	onProgress?.(72, "Compressing package");
	const zipBytes = await out.generateAsync({
		type: "uint8array",
		compression: "DEFLATE",
		compressionOptions: { level: 6 }
	}, (meta) => {
		const pct = 72 + Math.round(meta.percent / 100 * 14);
		onProgress?.(pct, "Compressing package");
	});
	onProgress?.(88, "Aligning and signing (v2)");
	const signed = await signApk(zipBytes, material);
	onProgress?.(100, "Package ready");
	return signed;
}
function downloadApk(bytes, fileName) {
	const blob = new Blob([bytes], { type: "application/vnd.android.package-archive" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName.endsWith(".apk") ? fileName.replace(/\.apk$/i, "-reskin.apk") : `${fileName}-reskin.apk`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
async function shareApk(bytes, fileName) {
	const name = fileName.endsWith(".apk") ? fileName.replace(/\.apk$/i, "-reskin.apk") : `${fileName}-reskin.apk`;
	const file = new File([bytes], name, { type: "application/vnd.android.package-archive" });
	const nav = navigator;
	if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && nav.share) {
		await nav.share({
			files: [file],
			title: name
		});
		return true;
	}
	downloadApk(bytes, fileName);
	return false;
}
var DEFAULT_THRESHOLD = .8;
function applyThreshold(matches, threshold) {
	const names = new Set(matches.filter((m) => m.score >= threshold).map((m) => m.image.baseName));
	return matches.map((m) => ({
		...m,
		selected: m.score >= threshold || names.has(m.image.baseName)
	}));
}
function Workspace() {
	const zipRef = (0, import_react.useRef)(null);
	const autoScanRef = (0, import_react.useRef)(false);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [progressLabel, setProgressLabel] = (0, import_react.useState)("");
	const [info, setInfo] = (0, import_react.useState)(null);
	const [images, setImages] = (0, import_react.useState)([]);
	const [source, setSource] = (0, import_react.useState)(null);
	const [replacement, setReplacement] = (0, import_react.useState)(null);
	const [matches, setMatches] = (0, import_react.useState)([]);
	const [threshold, setThreshold] = (0, import_react.useState)(DEFAULT_THRESHOLD);
	const [fit, setFit] = (0, import_react.useState)("cover");
	const [built, setBuilt] = (0, import_react.useState)(null);
	const [how, setHow] = (0, import_react.useState)(false);
	const [busyDemo, setBusyDemo] = (0, import_react.useState)(false);
	const reset = (0, import_react.useCallback)(() => {
		zipRef.current = null;
		autoScanRef.current = false;
		source?.bitmap.close();
		replacement?.bitmap.close();
		if (source?.objectUrl) URL.revokeObjectURL(source.objectUrl);
		if (replacement?.objectUrl) URL.revokeObjectURL(replacement.objectUrl);
		for (const m of matches) if (m.previewUrl) URL.revokeObjectURL(m.previewUrl);
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
	}, [
		matches,
		replacement,
		source
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			source?.bitmap.close();
			replacement?.bitmap.close();
			if (source?.objectUrl) URL.revokeObjectURL(source.objectUrl);
			if (replacement?.objectUrl) URL.revokeObjectURL(replacement.objectUrl);
		};
	}, []);
	const onProgress = (0, import_react.useCallback)((percent, label) => {
		setProgress(percent);
		setProgressLabel(label);
	}, []);
	const ingestApk = (0, import_react.useCallback)(async (file, demoInfo) => {
		setPhase("loading");
		setBuilt(null);
		try {
			const { zip, info: parsed, images: found } = await loadApk(file, file.name, onProgress);
			zipRef.current = zip;
			setInfo(demoInfo ?? parsed);
			setImages(found);
			setMatches([]);
			setPhase("ready");
			if (found.length === 0) toast.error("No raster images found in this package.");
		} catch (err) {
			console.error(err);
			toast.error("Could not read that package. Use a valid .apk file.");
			setPhase("idle");
		}
	}, [onProgress]);
	const onApkFile = (0, import_react.useCallback)((file) => {
		ingestApk(file);
	}, [ingestApk]);
	const onSourceFile = (0, import_react.useCallback)(async (file) => {
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
	const onReplaceFile = (0, import_react.useCallback)(async (file) => {
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
	const runScan = (0, import_react.useCallback)(async () => {
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
				setProgress(55 + Math.round(done / total * 40));
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
	}, [
		fit,
		images,
		replacement,
		source,
		threshold
	]);
	const onThreshold = (0, import_react.useCallback)((value) => {
		const t = (value[0] ?? 68) / 100;
		setThreshold(t);
		setMatches((prev) => applyThreshold(prev, t));
	}, []);
	const onFit = (0, import_react.useCallback)(async (next) => {
		setFit(next);
		if (!replacement || matches.length === 0) return;
		setProgressLabel("Refitting previews");
		const updated = await buildPreviews(replacement.bitmap, matches, next);
		setMatches(updated);
	}, [matches, replacement]);
	const toggleMatch = (0, import_react.useCallback)((path) => {
		setMatches((prev) => prev.map((m) => m.image.path === path ? {
			...m,
			selected: !m.selected
		} : m));
	}, []);
	const selectedCount = (0, import_react.useMemo)(() => matches.filter((m) => m.selected).length, [matches]);
	const runBuild = (0, import_react.useCallback)(async () => {
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
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		} catch (err) {
			console.error(err);
			toast.error("Rebuild failed. The package may be an unusual ZIP.");
			setPhase("review");
		}
	}, [
		fit,
		info,
		matches,
		onProgress,
		replacement,
		selectedCount
	]);
	const runDemo = (0, import_react.useCallback)(async () => {
		setBusyDemo(true);
		setPhase("loading");
		try {
			const demo = await buildDemoPack();
			const src = await sourcePngBlob(192);
			const rep = await replacePngBlob(512);
			await ingestApk(demo.file, demo.info);
			await onSourceFile(src);
			await onReplaceFile(rep);
			setTimeout(() => {}, 0);
		} catch (err) {
			console.error(err);
			toast.error("Could not build the demo pack.");
			setPhase("idle");
		} finally {
			setBusyDemo(false);
		}
	}, [
		ingestApk,
		onReplaceFile,
		onSourceFile
	]);
	const demoScanKey = info?.isDemo && source && replacement && phase === "ready" && images.length > 0;
	(0, import_react.useEffect)(() => {
		if (demoScanKey && !autoScanRef.current) {
			autoScanRef.current = true;
			runScan();
		}
	}, [demoScanKey]);
	const onDownload = (0, import_react.useCallback)(() => {
		if (!built || !info) return;
		downloadApk(built, info.fileName);
	}, [built, info]);
	const onShare = (0, import_react.useCallback)(async () => {
		if (!built || !info) return;
		try {
			if (await shareApk(built, info.fileName)) toast.success("Shared — open the file to install.");
		} catch {
			downloadApk(built, info.fileName);
		}
	}, [built, info]);
	const canScan = Boolean(source && replacement && images.length && phase === "ready");
	const showWorkbench = phase !== "idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-border/80 bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReskinMark, { className: "size-7 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-medium tracking-tight",
							children: "Reskin"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: showWorkbench ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: reset,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {}), "Start over"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setHow((v) => !v),
							children: "How it works"
						})
					})]
				})
			}),
			how ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, { onClose: () => setHow(false) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-28 pt-8 sm:pt-12",
				children: [
					!showWorkbench ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, {
						onApk: onApkFile,
						onDemo: () => void runDemo(),
						busyDemo
					}) : null,
					phase === "loading" || phase === "scanning" || phase === "building" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusyCard, {
						progress,
						label: progressLabel,
						phase
					}) : null,
					showWorkbench && phase !== "loading" && info ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stagger-in space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageBar, {
								info,
								imageCount: images.length
							}),
							phase === "ready" || phase === "review" || phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePair, {
								source,
								replacement,
								onSource: onSourceFile,
								onReplace: onReplaceFile,
								disabled: phase === "done"
							}) : null,
							phase === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [images.length, " images in the package. Scan finds every asset related to the first image, then fits the second to each size."]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									disabled: !canScan,
									onClick: () => void runScan(),
									children: "Find related images"
								})]
							}) : null,
							phase === "done" && built ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneCard, {
								info,
								bytes: built,
								replaced: selectedCount,
								onDownload,
								onShare: () => void onShare(),
								onBack: () => setPhase("review")
							}) : null,
							phase === "review" || phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchSection, {
								matches,
								threshold,
								fit,
								selectedCount,
								onThreshold,
								onFit: (f) => void onFit(f),
								onToggle: toggleMatch,
								onSelectAll: (on) => setMatches((prev) => prev.map((m) => ({
									...m,
									selected: on
								})))
							}) : null
						]
					}) : null
				]
			}),
			phase === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-fg",
							children: selectedCount
						}), " selected"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						onClick: () => void runBuild(),
						disabled: selectedCount === 0,
						children: "Rebuild APK"
					})]
				})
			}) : null
		]
	});
}
function Landing({ onApk, onDemo, busyDemo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.18em] text-muted",
				children: "APK image workshop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-medium leading-tight tracking-[-0.03em] text-fg sm:text-5xl",
				children: "Print a new skin onto any APK."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-base text-muted sm:text-lg",
				children: "Drop a package and two pictures. Reskin finds every related image, resizes your art to match, rebuilds a signed APK, and lets you install it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
					accept: ".apk,application/vnd.android.package-archive,application/zip",
					label: "Drop an APK, or browse",
					hint: "Processed on this device — nothing is uploaded",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
						className: "size-8",
						strokeWidth: 1.4
					}),
					onFile: onApk,
					disabled: busyDemo
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: onDemo,
					disabled: busyDemo,
					children: [busyDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {}), "Try the demo pack"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: "Works in the browser. Install from Android after download."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-16 grid gap-6 sm:grid-cols-3",
				children: [
					{
						n: "01",
						t: "Package",
						d: "Open any APK. We read every PNG, JPEG, and WebP inside."
					},
					{
						n: "02",
						t: "Match",
						d: "Your first image finds siblings — densities, pressed states, copies."
					},
					{
						n: "03",
						t: "Install",
						d: "The second image is fitted to each size. Rebuild, sign, install."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-faint",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-xl font-medium",
							children: s.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: s.d
						})
					]
				}, s.n))
			})
		]
	});
}
function HowItWorks({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl space-y-3 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "An APK is a zip of an Android app. Icons and art live in several sizes (mdpi through xxxhdpi). Reskin hashes your first image, finds lookalikes plus the same filename in other density folders, then draws your second image into each slot — covering, containing, or stretching to the original pixels and format, including 9-patch borders." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The rebuilt package is zipaligned and signed with a Reskin key stored in this browser, so Android will install it. Because the signature differs from the original, uninstall the store copy first. Apps that check Play Integrity or tamper detection may refuse to run after resigning." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onClose,
					children: "Close"
				})]
			})
		})
	});
}
function BusyCard({ progress, label, phase }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg rounded-xl border border-border bg-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: phase === "loading" ? "Reading package" : phase === "scanning" ? "Matching images" : "Rebuilding APK"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: label || "Working"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				className: "mt-4",
				value: progress
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-right font-mono text-xs tabular-nums text-faint",
				children: [Math.round(progress), "%"]
			})
		]
	});
}
function PackageBar({ info, imageCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: info.packageName ?? info.fileName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-muted",
					children: [
						info.fileName,
						info.versionName ? ` · v${info.versionName}` : "",
						` · ${formatBytes(info.size)}`
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [imageCount, " images"] }),
			info.isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "accent",
				children: "Demo"
			}) : null
		]
	});
}
function ImagePair({ source, replacement, onSource, onReplace, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted",
			children: "Find this"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
			accept: "image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp",
			label: "Original art to search for",
			hint: "A screenshot or export of the existing image",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
				className: "size-7",
				strokeWidth: 1.4
			}),
			disabled,
			compact: true,
			onFile: onSource,
			preview: source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePreview, {
				url: source.objectUrl,
				caption: `${source.width}×${source.height}`
			}) : void 0
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted",
			children: "Replace with"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
			accept: "image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp",
			label: "New art to stamp in",
			hint: "Fitted to every related size and format",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
				className: "size-7",
				strokeWidth: 1.4
			}),
			disabled,
			compact: true,
			onFile: onReplace,
			preview: replacement ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePreview, {
				url: replacement.objectUrl,
				caption: `${replacement.width}×${replacement.height}`
			}) : void 0
		})] })]
	});
}
function ImagePreview({ url, caption }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full flex-col items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "checkerboard max-h-36 overflow-hidden rounded-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: "",
				className: "max-h-36 max-w-full object-contain"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-xs text-muted",
			children: caption
		})]
	});
}
function MatchSection({ matches, threshold, fit, selectedCount, onThreshold, onFit, onToggle, onSelectAll }) {
	const visible = matches.filter((m) => m.selected || m.score >= threshold - .05);
	const list = visible.length ? visible : matches.slice(0, 24);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium",
				children: "Related images"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					selectedCount,
					" of ",
					matches.length,
					" will be replaced"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => onSelectAll(true),
					children: "Select all"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => onSelectAll(false),
					children: "Clear"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Match tightness"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-fg",
						children: [Math.round(threshold * 100), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 40,
					max: 95,
					step: 1,
					value: [Math.round(threshold * 100)],
					onValueChange: onThreshold
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs text-muted",
				children: "Fit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-md bg-inset p-1",
				children: [
					"cover",
					"contain",
					"stretch"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onFit(f),
					className: cn("h-9 flex-1 rounded-sm text-xs font-medium capitalize transition-colors duration-150", fit === f ? "bg-raised text-fg" : "text-muted hover:text-fg"),
					children: f
				}, f))
			})] })]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-sm text-muted",
			children: "Nothing related enough. Drop a closer crop of the original, or loosen match tightness."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 grid gap-4 sm:grid-cols-2",
			children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, {
				match: m,
				onToggle: () => onToggle(m.image.path)
			}) }, m.image.path))
		})
	] });
}
function MatchCard({ match, onToggle }) {
	const { image, score, selected, previewUrl, reasons } = match;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onToggle,
		className: cn("flex w-full flex-col overflow-hidden rounded-lg border bg-raised text-left transition-[border-color,box-shadow] duration-150", selected ? "border-accent/50 shadow-[var(--shadow-border)]" : "border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-px bg-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, {
				src: image.thumbUrl,
				label: "Original"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, {
				src: previewUrl ?? image.thumbUrl,
				label: "Replacement"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border", selected ? "border-accent bg-accent text-accent-fg" : "border-border-strong"),
				children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : null
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-mono text-xs text-fg",
					children: image.path
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [
								image.width,
								"×",
								image.height
							]
						}),
						image.density ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: image.density }) : null,
						image.isNinePatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "warn",
							children: "9-patch"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: score >= .8 ? "ok" : "default",
							children: [Math.round(score * 100), "%"]
						}),
						reasons.some((r) => r.kind === "density") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "accent",
							children: "related"
						}) : null
					]
				})]
			})]
		})]
	});
}
function Thumb({ src, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "checkerboard relative flex h-32 items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			className: "max-h-32 max-w-full object-contain"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute bottom-1.5 left-1.5 rounded-sm bg-bg/80 px-1.5 py-0.5 text-xs uppercase tracking-wide text-muted",
			children: label
		})]
	});
}
function DoneCard({ info, bytes, replaced, onDownload, onShare, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-ok",
				children: "Ready to install"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-3xl font-medium tracking-tight",
				children: "Package rebuilt."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-xl text-sm text-muted",
				children: [
					"Replaced ",
					replaced,
					" image",
					replaced === 1 ? "" : "s",
					" in ",
					info.fileName,
					". Signed with a Reskin key so Android will accept the install. Uninstall the original app first if it is already on the device."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						onClick: onDownload,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Download APK"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						variant: "secondary",
						onClick: onShare,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), "Share to install"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						variant: "ghost",
						onClick: onBack,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Adjust matches"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-xs text-faint",
				children: [formatBytes(bytes.byteLength), " · On Android, enable install from this browser if prompted. Play Integrity apps may refuse a resigned package."]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {});
}
//#endregion
export { Home as component };
