import { isUrlAbsolute } from '@/util';
import { expect } from 'chai';

describe('URL utilities', function () {
  describe('isUrlAbsolute', function () {
    it('should pass for absolute URLs', function () {
      expect(isUrlAbsolute('http://example.com')).to.be.true;
      expect(isUrlAbsolute('https://example.com')).to.be.true;
      expect(isUrlAbsolute('https://example.com:8000')).to.be.true;
      expect(isUrlAbsolute('192.168.1.1')).to.be.true;
    });

    it('should fail for relative URLs', function () {
      expect(isUrlAbsolute('relative')).to.be.false;
      expect(isUrlAbsolute('/relative')).to.be.false;
    });
  });
});
