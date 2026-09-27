import {
  OID,
  algorithmIdentifier,
  bitString,
  concat,
  context,
  fromBase64,
  integerBytes,
  integerNum,
  nameCn,
  octetString,
  oid,
  seq,
  setOf,
  sha256,
  toBase64,
  utcTime,
  wrap72,
} from "./der";
import { zipalign } from "./zipalign";

const KEY_STORAGE = "reskin.signing-key.v1";
const SIG_ALG_V2 = 0x0103; // RSASSA-PKCS1-v1_5 + SHA-256
const V2_BLOCK_ID = 0x7109871a;
const MAGIC = new TextEncoder().encode("APK Sig Block 42");
const CHUNK = 1024 * 1024;

export interface SigningMaterial {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  certDer: Uint8Array;
  spki: Uint8Array;
}

interface StoredKey {
  pkcs8: string;
  spki: string;
  cert: string;
}

const rsaParams: RsaHashedImportParams = {
  name: "RSASSA-PKCS1-v1_5",
  hash: "SHA-256",
};

async function generateCert(
  publicKey: CryptoKey,
  privateKey: CryptoKey,
): Promise<{ certDer: Uint8Array; spki: Uint8Array }> {
  const spki = new Uint8Array(await crypto.subtle.exportKey("spki", publicKey));
  const serial = crypto.getRandomValues(new Uint8Array(8));
  serial[0] = serial[0]! & 0x7f;

  const notBefore = new Date(Date.UTC(2020, 0, 1));
  const notAfter = new Date(Date.UTC(2049, 11, 31, 23, 59, 59));
  const subject = nameCn("Reskin", "Reskin");

  const tbs = seq(
    context(0, integerNum(2)),
    integerBytes(serial),
    algorithmIdentifier(OID.sha256WithRSA),
    subject,
    seq(utcTime(notBefore), utcTime(notAfter)),
    subject,
    spki,
  );

  const signature = new Uint8Array(
    await crypto.subtle.sign(rsaParams, privateKey, tbs as BufferSource),
  );

  const certDer = seq(
    tbs,
    algorithmIdentifier(OID.sha256WithRSA),
    bitString(signature),
  );

  return { certDer, spki };
}

export async function loadSigningMaterial(): Promise<SigningMaterial> {
  try {
    const raw = localStorage.getItem(KEY_STORAGE);
    if (raw) {
      const stored = JSON.parse(raw) as StoredKey;
      const pkcs8 = fromBase64(stored.pkcs8);
      const spki = fromBase64(stored.spki);
      const certDer = fromBase64(stored.cert);
      const privateKey = await crypto.subtle.importKey("pkcs8", pkcs8 as BufferSource, rsaParams, true, ["sign"]);
      const publicKey = await crypto.subtle.importKey("spki", spki as BufferSource, rsaParams, true, ["verify"]);
      return { privateKey, publicKey, certDer, spki };
    }
  } catch {
    // regenerate
  }

  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );

  const { certDer, spki } = await generateCert(pair.publicKey, pair.privateKey);
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  const stored: StoredKey = {
    pkcs8: toBase64(pkcs8),
    spki: toBase64(spki),
    cert: toBase64(certDer),
  };
  try {
    localStorage.setItem(KEY_STORAGE, JSON.stringify(stored));
  } catch {
    // storage full — still usable this session
  }
  return {
    privateKey: pair.privateKey,
    publicKey: pair.publicKey,
    certDer,
    spki,
  };
}

function isSignaturePath(name: string): boolean {
  const n = name.replace(/\\/g, "/");
  if (!n.toUpperCase().startsWith("META-INF/")) return false;
  return (
    /\/MANIFEST\.MF$/i.test(n) ||
    /\.(SF|RSA|DSA|EC)$/i.test(n) ||
    /\/SIG-/i.test(n)
  );
}

function manifestSection(name: string, digestB64: string): string {
  return wrap72(`Name: ${name}\r\nSHA-256-Digest: ${digestB64}\r\n\r\n`);
}

export async function buildV1Entries(
  files: { name: string; data: Uint8Array }[],
  material: SigningMaterial,
): Promise<{ name: string; data: Uint8Array }[]> {
  const encoder = new TextEncoder();
  const entries = files.filter((f) => !isSignaturePath(f.name) && !f.name.endsWith("/"));

  let manifest = "Manifest-Version: 1.0\r\nCreated-By: Reskin\r\n\r\n";
  const sections: { name: string; section: string }[] = [];

  for (const file of entries) {
    const digest = toBase64(await sha256(file.data as BufferSource));
    const section = manifestSection(file.name, digest);
    sections.push({ name: file.name, section });
    manifest += section;
  }

  const manifestBytes = encoder.encode(manifest);
  const manifestDigest = toBase64(await sha256(manifestBytes as BufferSource));

  let sf = wrap72(
    `Signature-Version: 1.0\r\nCreated-By: Reskin\r\nSHA-256-Digest-Manifest: ${manifestDigest}\r\n\r\n`,
  );
  for (const s of sections) {
    const secDigest = toBase64(await sha256(encoder.encode(s.section) as BufferSource));
    sf += wrap72(`Name: ${s.name}\r\nSHA-256-Digest: ${secDigest}\r\n\r\n`);
  }
  const sfBytes = encoder.encode(sf);

  const signature = new Uint8Array(
    await crypto.subtle.sign(rsaParams, material.privateKey, sfBytes as BufferSource),
  );

  const pkcs7 = seq(
    oid(OID.signedData),
    context(
      0,
      seq(
        integerNum(1),
        setOf(algorithmIdentifier(OID.sha256)),
        seq(oid(OID.data)),
        context(0, material.certDer),
        setOf(
          seq(
            integerNum(1),
            seq(
              nameCn("Reskin", "Reskin"),
              integerBytes(readSerial(material.certDer)),
            ),
            algorithmIdentifier(OID.sha256),
            algorithmIdentifier(OID.sha256WithRSA),
            octetString(signature),
          ),
        ),
      ),
    ),
  );

  return [
    { name: "META-INF/MANIFEST.MF", data: manifestBytes },
    { name: "META-INF/CERT.SF", data: sfBytes },
    { name: "META-INF/CERT.RSA", data: pkcs7 },
  ];
}

function readSerial(cert: Uint8Array): Uint8Array {
  // Certificate = SEQ { TBS = SEQ { [0] version, serial INTEGER, ... } }
  // Walk into the first two sequences and take the INTEGER after the version context.
  let i = 0;
  const expect = (tag: number) => {
    if (cert[i] !== tag) throw new Error("Cert parse");
    i++;
    const { len, header } = readLen(cert, i);
    i += header;
    return len;
  };
  expect(0x30); // cert
  expect(0x30); // tbs
  if (cert[i] === 0xa0) {
    i++;
    const { len, header } = readLen(cert, i);
    i += header + len;
  }
  if (cert[i] !== 0x02) throw new Error("Serial missing");
  i++;
  const { len, header } = readLen(cert, i);
  i += header;
  return cert.subarray(i, i + len);
}

function readLen(buf: Uint8Array, i: number): { len: number; header: number } {
  const b = buf[i]!;
  if (b < 0x80) return { len: b, header: 1 };
  const n = b & 0x7f;
  let len = 0;
  for (let k = 0; k < n; k++) len = (len << 8) | buf[i + 1 + k]!;
  return { len, header: 1 + n };
}

export { isSignaturePath };

function u32le(n: number): Uint8Array {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n >>> 0, true);
  return b;
}
function u64le(n: number): Uint8Array {
  const b = new Uint8Array(8);
  new DataView(b.buffer).setBigUint64(0, BigInt(n), true);
  return b;
}

function lp(data: Uint8Array): Uint8Array {
  return concat(u32le(data.length), data);
}

function findEocd(apk: Uint8Array): { offset: number; cdOffset: number; cdSize: number } {
  const view = new DataView(apk.buffer, apk.byteOffset, apk.byteLength);
  for (let i = apk.length - 22; i >= Math.max(0, apk.length - 22 - 0xffff); i--) {
    if (view.getUint32(i, true) !== 0x06054b50) continue;
    const commentLen = view.getUint16(i + 20, true);
    if (i + 22 + commentLen !== apk.length) continue;
    return {
      offset: i,
      cdSize: view.getUint32(i + 12, true),
      cdOffset: view.getUint32(i + 16, true),
    };
  }
  throw new Error("Invalid APK: ZIP end record not found");
}

async function chunkDigests(parts: Uint8Array[]): Promise<Uint8Array[]> {
  const out: Uint8Array[] = [];
  for (const part of parts) {
    for (let off = 0; off < part.length; off += CHUNK) {
      const slice = part.subarray(off, Math.min(part.length, off + CHUNK));
      const prefixed = concat(Uint8Array.of(0xa5), u32le(slice.length), slice);
      out.push(await sha256(prefixed as BufferSource));
    }
  }
  return out;
}

export async function signV2(apk: Uint8Array, material: SigningMaterial): Promise<Uint8Array> {
  const { offset: eocdOffset, cdOffset, cdSize } = findEocd(apk);
  const contents = apk.subarray(0, cdOffset);
  const cd = apk.subarray(cdOffset, cdOffset + cdSize);
  const eocd = apk.slice(eocdOffset); // copy — we may patch offset later

  const chunks = await chunkDigests([contents, cd, eocd]);
  const tree = concat(
    Uint8Array.of(0x5a),
    u32le(chunks.length),
    ...chunks,
  );
  const digest = await sha256(tree as BufferSource);

  const digestEntry = concat(u32le(SIG_ALG_V2), lp(digest));
  const digests = lp(lp(digestEntry));
  const certificates = lp(lp(material.certDer));
  const attributes = u32le(0);
  const signedData = concat(digests, certificates, attributes);

  const signature = new Uint8Array(
    await crypto.subtle.sign(rsaParams, material.privateKey, signedData as BufferSource),
  );
  const sigEntry = concat(u32le(SIG_ALG_V2), lp(signature));
  const signatures = lp(lp(sigEntry));
  const publicKey = lp(material.spki);
  const signer = concat(lp(signedData), signatures, publicKey);
  const signers = lp(lp(signer));

  // pair: uint64 size_of(id+value), uint32 id, value
  const pairValue = signers;
  const pair = concat(u64le(4 + pairValue.length), u32le(V2_BLOCK_ID), pairValue);

  const blockSizeMinus8 = 8 + pair.length + 8 + 16;
  const block = concat(
    u64le(blockSizeMinus8),
    pair,
    u64le(blockSizeMinus8),
    MAGIC,
  );

  const out = new Uint8Array(contents.length + block.length + cd.length + eocd.length);
  out.set(contents, 0);
  out.set(block, contents.length);
  out.set(cd, contents.length + block.length);
  const newEocdOff = contents.length + block.length + cd.length;
  out.set(eocd, newEocdOff);
  const view = new DataView(out.buffer);
  view.setUint32(newEocdOff + 16, contents.length + block.length, true);
  return out;
}

export async function signApk(
  zipBytes: Uint8Array,
  material: SigningMaterial,
): Promise<Uint8Array> {
  const aligned = zipalign(zipBytes);
  return signV2(aligned, material);
}
