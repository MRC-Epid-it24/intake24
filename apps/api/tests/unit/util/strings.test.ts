import { isUrlAbsolute, generateToken, toSimpleName } from '@api/util';

describe('String utilities', () => {
  describe('isUrlAbsolute', () => {
    it('should pass for absolute URLs', () => {
      expect(isUrlAbsolute('http://example.com')).toBe(true);
      expect(isUrlAbsolute('https://example.com')).toBe(true);
      expect(isUrlAbsolute('https://example.com:8000')).toBe(true);
      expect(isUrlAbsolute('192.168.1.1')).toBe(true);
    });

    it('should fail for relative URLs', () => {
      expect(isUrlAbsolute('relative')).toBe(false);
      expect(isUrlAbsolute('/relative')).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should produce 21-token with defaults', () => {
      expect(generateToken()).toHaveLength(21);
    });

    it('should produce token of defined ', () => {
      expect(generateToken(10)).toHaveLength(10);
    });

    it('should produce token of defined alphabet', () => {
      const token = generateToken(5, 'a');

      expect(token).toHaveLength(5);
      expect(token).toEqual('aaaaa');
    });
  });

  describe('toSimpleName', () => {
    it('should got null with falsy arguments', () => {
      expect(toSimpleName()).toBeNull();
      expect(toSimpleName(null)).toBeNull();
      expect(toSimpleName('')).toBeNull();
    });

    it('should remove special chars and lower cases', () => {
      expect(toSimpleName('Kateřina Nováková')).toEqual('katerina novakova');

      expect(toSimpleName('ěš čř žý áíé úů ĚŠ ČŘ ŽÝ ÁÍÉ ÚŮ')).toEqual(
        'es cr zy aie uu es cr zy aie uu'
      );
    });
  });
});
