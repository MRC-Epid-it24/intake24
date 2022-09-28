import { toStandardUnitId } from '@intake24/api/util';

describe('toStandardUnitId', () => {
  it('should remove special chars / lower cases / underscore separator', () => {
    expect(toStandardUnitId('ěš čř žý áíé úů ĚŠ ČŘ ŽÝ ÁÍÉ ÚŮ')).toEqual(
      'es_cr_zy_aie_uu_es_cr_zy_aie_uu'
    );
  });
});
