const CHUNK_XML = 0x0003;
const CHUNK_STRING_POOL = 0x0001;
const CHUNK_START_ELEMENT = 0x0102;
const UTF8_FLAG = 1 << 8;

export interface ManifestInfo {
  packageName?: string;
  versionName?: string;
  versionCode?: number;
}

function u16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}
function u32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function decodeUtf16(bytes: Uint8Array, start: number, charCount: number): string {
  const codes: number[] = [];
  for (let i = 0; i < charCount; i++) {
    codes.push(bytes[start + i * 2]! | (bytes[start + i * 2 + 1]! << 8));
  }
  return String.fromCharCode(...codes);
}

function decodeUtf8(bytes: Uint8Array, start: number, byteCount: number): string {
  return new TextDecoder("utf-8").decode(bytes.subarray(start, start + byteCount));
}

function readStringPool(bytes: Uint8Array, poolOff: number): string[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const stringCount = u32(view, poolOff + 8);
  const flags = u32(view, poolOff + 16);
  const stringsStart = u32(view, poolOff + 20);
  const utf8 = (flags & UTF8_FLAG) !== 0;
  const out: string[] = [];

  for (let i = 0; i < stringCount; i++) {
    const rel = u32(view, poolOff + 28 + i * 4);
    let p = poolOff + stringsStart + rel;
    try {
      if (utf8) {
        // charLen (1-2 bytes), byteLen (1-2 bytes), bytes, 0x00
        let charLen = bytes[p]!;
        p += 1;
        if (charLen & 0x80) {
          charLen = ((charLen & 0x7f) << 8) | bytes[p]!;
          p += 1;
        }
        let byteLen = bytes[p]!;
        p += 1;
        if (byteLen & 0x80) {
          byteLen = ((byteLen & 0x7f) << 8) | bytes[p]!;
          p += 1;
        }
        out.push(decodeUtf8(bytes, p, byteLen));
      } else {
        let charCount = bytes[p]! | (bytes[p + 1]! << 8);
        p += 2;
        if (charCount & 0x8000) {
          charCount = ((charCount & 0x7fff) << 16) | (bytes[p]! | (bytes[p + 1]! << 8));
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

export function parseBinaryManifest(data: Uint8Array): ManifestInfo {
  if (data.byteLength < 8) return {};
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const type = u16(view, 0);
  if (type !== CHUNK_XML && type !== CHUNK_STRING_POOL) {
    // Maybe plain XML
    const text = new TextDecoder("utf-8", { fatal: false }).decode(data.subarray(0, Math.min(data.length, 4096)));
    if (text.includes("<manifest")) {
      const pkg = text.match(/package\s*=\s*"([^"]+)"/)?.[1];
      const vn = text.match(/versionName\s*=\s*"([^"]+)"/)?.[1];
      const vc = text.match(/versionCode\s*=\s*"([^"]+)"/)?.[1];
      return {
        packageName: pkg,
        versionName: vn,
        versionCode: vc ? Number(vc) : undefined,
      };
    }
    return {};
  }

  let strings: string[] = [];
  let offset = 0;
  const fileSize = data.byteLength;
  const info: ManifestInfo = {};

  while (offset + 8 <= fileSize) {
    const chunkType = u16(view, offset);
    const headerSize = u16(view, offset + 2);
    const chunkSize = u32(view, offset + 4);
    if (chunkSize < 8 || offset + chunkSize > fileSize) break;

    if (chunkType === CHUNK_STRING_POOL) {
      strings = readStringPool(data, offset);
    } else if (chunkType === CHUNK_START_ELEMENT && headerSize >= 36) {
      const nameIdx = u32(view, offset + 20);
      const name = strings[nameIdx] ?? "";
      const attrStart = u16(view, offset + 24);
      const attrSize = u16(view, offset + 26);
      const attrCount = u16(view, offset + 28);
      if (name === "manifest") {
        for (let i = 0; i < attrCount; i++) {
          const aOff = offset + attrStart + i * (attrSize || 20);
          if (aOff + 20 > offset + chunkSize) break;
          const attrNameIdx = u32(view, aOff + 4);
          const rawIdx = u32(view, aOff + 8);
          const dataType = data[aOff + 15];
          const attrData = u32(view, aOff + 16);
          const attrName = strings[attrNameIdx] ?? "";
          const raw = rawIdx !== 0xffffffff ? strings[rawIdx] : undefined;
          if (attrName === "package" && raw) info.packageName = raw;
          if (attrName === "versionName" && raw) info.versionName = raw;
          if (attrName === "versionCode") {
            if (dataType === 0x10) info.versionCode = attrData;
            else if (raw) info.versionCode = Number(raw);
          }
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
