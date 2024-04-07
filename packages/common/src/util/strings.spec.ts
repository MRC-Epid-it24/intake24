import { randomString, toStandardUnitId } from '@intake24/common/util';

describe('toStandardUnitId', () => {
  it('should remove special chars / lower cases / underscore separator', () => {
    expect(toStandardUnitId('ěš čř žý áíé úů ĚŠ ČŘ ŽÝ ÁÍÉ ÚŮ')).toEqual(
      'es_cr_zy_aie_uu_es_cr_zy_aie_uu',
    );
  });
});

describe('randomString', () => {
  it('should produce string of defined length', () => {
    expect(randomString(10)).toHaveLength(10);
  });

  it('should produce string of defined alphabet', () => {
    const token = randomString(5, 'a');

    expect(token).toHaveLength(5);
    expect(token).toEqual('aaaaa');
  });
});
