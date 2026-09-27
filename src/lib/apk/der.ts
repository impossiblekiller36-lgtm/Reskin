/** Minimal DER encoder for X.509 certificates and PKCS#7 SignedData. */

export function concat(...parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function encodeLength(n: number): Uint8Array {
  if (n < 0x80) return Uint8Array.of(n);
  const bytes: number[] = [];
  let x = n;
  while (x > 0) {
    bytes.unshift(x & 0xff);
    x >>= 8;
  }
  return Uint8Array.of(0x80 | bytes.length, ...bytes);
}

export function tlv(tag: number, contents: Uint8Array): Uint8Array {
  return concat(Uint8Array.of(tag), encodeLength(contents.length), contents);
}

export function seq(...parts: Uint8Array[]): Uint8Array {
  return tlv(0x30, concat(...parts));
}

export function setOf(...parts: Uint8Array[]): Uint8Array {
  return tlv(0x31, concat(...parts));
}

export function derNull(): Uint8Array {
  return Uint8Array.of(0x05, 0x00);
}

export function octetString(bytes: Uint8Array): Uint8Array {
  return tlv(0x04, bytes);
}

export function bitString(bytes: Uint8Array, unused = 0): Uint8Array {
  return tlv(0x03, concat(Uint8Array.of(unused), bytes));
}

export function integerBytes(bytes: Uint8Array): Uint8Array {
  let b = bytes;
  while (b.length > 1 && b[0] === 0) b = b.subarray(1);
  if (b[0]! & 0x80) b = concat(Uint8Array.of(0), b);
  return tlv(0x02, b);
}

export function integerNum(n: number): Uint8Array {
  if (n === 0) return Uint8Array.of(0x02, 0x01, 0x00);
  const bytes: number[] = [];
  let x = n;
  while (x > 0) {
    bytes.unshift(x & 0xff);
    x >>= 8;
  }
  if (bytes[0]! & 0x80) bytes.unshift(0);
  return tlv(0x02, Uint8Array.from(bytes));
}

export function oid(str: string): Uint8Array {
  const parts = str.split(".").map(Number);
  const body: number[] = [40 * parts[0]! + parts[1]!];
  for (let i = 2; i < parts.length; i++) {
    let v = parts[i]!;
    const stack: number[] = [];
    stack.push(v & 0x7f);
    v >>= 7;
    while (v > 0) {
      stack.push(0x80 | (v & 0x7f));
      v >>= 7;
    }
    for (let j = stack.length - 1; j >= 0; j--) body.push(stack[j]!);
  }
  return tlv(0x06, Uint8Array.from(body));
}

export function utf8(s: string): Uint8Array {
  return tlv(0x0c, new TextEncoder().encode(s));
}

export function utcTime(d: Date): Uint8Array {
  const yy = String(d.getUTCFullYear()).slice(-2);
  const pad = (n: number) => String(n).padStart(2, "0");
  const s = `${yy}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  return tlv(0x17, new TextEncoder().encode(s));
}

export const OID = {
  sha256WithRSA: "1.2.840.113549.1.1.11",
  rsaEncryption: "1.2.840.113549.1.1.1",
  sha256: "2.16.840.1.101.3.4.2.1",
  commonName: "2.5.4.3",
  organization: "2.5.4.10",
  signedData: "1.2.840.113549.1.7.2",
  data: "1.2.840.113549.1.7.1",
  basicConstraints: "2.5.29.19",
  keyUsage: "2.5.29.15",
} as const;

export function algorithmIdentifier(oidStr: string, withNull = true): Uint8Array {
  return seq(oid(oidStr), ...(withNull ? [derNull()] : []));
}

export function nameCn(cn: string, org = "Reskin"): Uint8Array {
  return seq(
    setOf(seq(oid(OID.commonName), utf8(cn))),
    setOf(seq(oid(OID.organization), utf8(org))),
  );
}

export function context(tag: number, contents: Uint8Array, constructed = true): Uint8Array {
  return tlv((constructed ? 0xa0 : 0x80) | tag, contents);
}

export function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

export function fromBase64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function sha256(data: BufferSource): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

export function wrap72(text: string): string {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines: string[] = [];
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
