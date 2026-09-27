/**
 * Android zipalign: pad STORED (uncompressed) local-file extra fields so
 * file data starts on an alignment boundary. `.so` uses 4096, everything
 * else 4.
 */

const LOCAL_SIG = 0x04034b50;
const CD_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;

function alignmentFor(name: string, method: number): number {
  if (method !== 0) return 1;
  if (name.endsWith(".so")) return 4096;
  return 4;
}

function findEocd(buf: Uint8Array, view: DataView): number {
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (view.getUint32(i, true) !== EOCD_SIG) continue;
    const comment = view.getUint16(i + 20, true);
    if (i + 22 + comment === buf.length) return i;
  }
  throw new Error("Invalid ZIP: end record missing");
}

interface CdEntry {
  header: Uint8Array;
  name: string;
  localOffset: number;
}

export function zipalign(input: Uint8Array): Uint8Array {
  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const eocd = findEocd(input, view);
  const count = view.getUint16(eocd + 10, true);
  const cdSize = view.getUint32(eocd + 12, true);
  const cdOffset = view.getUint32(eocd + 16, true);
  if (view.getUint32(eocd + 4, true) !== 0 || view.getUint16(eocd + 8, true) !== count) {
    // Multi-disk or mismatch — return as-is
    return input;
  }

  const decoder = new TextDecoder("utf-8");
  const entries: CdEntry[] = [];
  let p = cdOffset;
  for (let i = 0; i < count; i++) {
    if (p + 46 > input.length || view.getUint32(p, true) !== CD_SIG) {
      return input;
    }
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const localOffset = view.getUint32(p + 42, true);
    const name = decoder.decode(input.subarray(p + 46, p + 46 + nameLen));
    const size = 46 + nameLen + extraLen + commentLen;
    entries.push({ header: input.subarray(p, p + size), name, localOffset });
    p += size;
  }
  if (p !== cdOffset + cdSize) return input;

  const localChunks: Uint8Array[] = [];
  const newOffsets: number[] = [];
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
      const next = cursor + headerLen + extraSoFar;
      const mis = next % align;
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

  const cdChunks: Uint8Array[] = [];
  let newCdSize = 0;
  for (let i = 0; i < entries.length; i++) {
    const src = entries[i]!.header;
    const copy = new Uint8Array(src);
    new DataView(copy.buffer).setUint32(42, newOffsets[i]!, true);
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
