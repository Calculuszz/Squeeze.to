const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BigInt(CHARSET.length); // 62n

/**
 * Encode a positive bigint (auto-increment id) into a base62 string.
 * Uses charset 0-9 a-z A-Z (62 characters).
 */
export function encode(id: bigint): string {
  if (id < 0n) {
    throw new RangeError('id must be non-negative');
  }
  if (id === 0n) {
    return CHARSET[0];
  }

  let n = id;
  const chars: string[] = [];
  while (n > 0n) {
    chars.push(CHARSET[Number(n % BASE)]);
    n = n / BASE;
  }
  return chars.reverse().join('');
}

/**
 * Decode a base62 string back to a bigint.
 */
export function decode(code: string): bigint {
  let result = 0n;
  for (const ch of code) {
    const idx = CHARSET.indexOf(ch);
    if (idx === -1) {
      throw new Error(`Invalid base62 character: "${ch}"`);
    }
    result = result * BASE + BigInt(idx);
  }
  return result;
}
