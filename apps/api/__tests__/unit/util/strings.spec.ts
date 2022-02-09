import { isUrlAbsolute, toSimpleName } from '@intake24/api/util';

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
