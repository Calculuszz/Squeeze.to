import { encode, decode } from './base62';

describe('base62', () => {
  describe('encode', () => {
    it('should encode 0 to "0"', () => {
      expect(encode(0n)).toBe('0');
    });

    it('should encode 1 to "1"', () => {
      expect(encode(1n)).toBe('1');
    });

    it('should encode 9 to "9"', () => {
      expect(encode(9n)).toBe('9');
    });

    it('should encode 10 to "a"', () => {
      expect(encode(10n)).toBe('a');
    });

    it('should encode 35 to "z"', () => {
      expect(encode(35n)).toBe('z');
    });

    it('should encode 36 to "A"', () => {
      expect(encode(36n)).toBe('A');
    });

    it('should encode 61 to "Z"', () => {
      expect(encode(61n)).toBe('Z');
    });

    it('should encode 62 to "10"', () => {
      expect(encode(62n)).toBe('10');
    });

    it('should encode 63 to "11"', () => {
      expect(encode(63n)).toBe('11');
    });

    it('should encode large numbers correctly', () => {
      // 62^2 = 3844 → "100"
      expect(encode(3844n)).toBe('100');
    });

    it('should throw for negative numbers', () => {
      expect(() => encode(-1n)).toThrow(RangeError);
    });
  });

  describe('decode', () => {
    it('should decode "0" to 0', () => {
      expect(decode('0')).toBe(0n);
    });

    it('should decode "Z" to 61', () => {
      expect(decode('Z')).toBe(61n);
    });

    it('should decode "10" to 62', () => {
      expect(decode('10')).toBe(62n);
    });

    it('should throw for invalid characters', () => {
      expect(() => decode('!@#')).toThrow('Invalid base62 character');
    });
  });

  describe('round-trip', () => {
    const testValues = [0n, 1n, 61n, 62n, 999n, 123456789n, 9999999999999n];

    it.each(testValues)('encode then decode should return %s', (val) => {
      expect(decode(encode(val))).toBe(val);
    });
  });
});
