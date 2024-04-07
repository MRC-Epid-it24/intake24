import {
  countDistanceViolations,
  countOrderViolations,
} from '@intake24/api/food-index/match-quality-helpers';

describe('match quality helpers', () => {
  describe('order violations', () => {
    it('empty input', () => {
      const input: number[] = [];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('case 1', () => {
      const input = [1, 2, 3, 4];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('case 2', () => {
      const input = [2, 1, 3, 4];

      expect(countOrderViolations(input)).toEqual(2);
    });

    it('case 3', () => {
      const input = [4, 3, 2, 1];

      expect(countOrderViolations(input)).toEqual(12);
    });

    it('case 4', () => {
      const input = [1, 1, 1, 1];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('case 5', () => {
      const input = [1];

      expect(countOrderViolations(input)).toEqual(0);
    });
  });

  describe('distance violations', () => {
    it('empty input', () => {
      const input: number[] = [];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('case 1', () => {
      const input = [1, 2, 3, 4];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('case 2', () => {
      const input = [1];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('case 3', () => {
      const input = [4, 3, 2, 1];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('case 4', () => {
      const input = [2, 4, 6, 8];

      expect(countDistanceViolations(input)).toEqual(3);
    });

    it('case 5', () => {
      const input = [10, 2, 8];

      expect(countDistanceViolations(input)).toEqual(12);
    });
  });
});
