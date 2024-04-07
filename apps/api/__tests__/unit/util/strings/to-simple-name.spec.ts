import { toSimpleName } from '@intake24/api/util';

describe('toSimpleName', () => {
  it('should got null with falsy arguments', () => {
    expect(toSimpleName()).toBeNull();
    expect(toSimpleName(null)).toBeNull();
    expect(toSimpleName('')).toBeNull();
  });

  it('should remove special chars and lower cases', () => {
    expect(toSimpleName('Kateřina Nováková')).toEqual('katerina novakova');

    expect(toSimpleName('ěš čř žý áíé úů ĚŠ ČŘ ŽÝ ÁÍÉ ÚŮ')).toEqual(
      'es cr zy aie uu es cr zy aie uu',
    );
  });
});
