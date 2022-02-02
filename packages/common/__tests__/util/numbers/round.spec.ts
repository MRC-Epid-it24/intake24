import { round } from '@intake24/common/util';

describe('round', () => {
  it('it should round to one precision as default param', () => {
    expect(round(12.12)).toEqual(12.1);
  });

  it('it should round to provided precision', () => {
    expect(round(12.121212, 0)).toEqual(12);
    expect(round(12.121212, 1)).toEqual(12.1);
    expect(round(12.121212, 2)).toEqual(12.12);
    expect(round(12.121212, 3)).toEqual(12.121);
  });
});
