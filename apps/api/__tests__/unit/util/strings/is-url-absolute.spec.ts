import { isUrlAbsolute } from '@intake24/api/util';

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
