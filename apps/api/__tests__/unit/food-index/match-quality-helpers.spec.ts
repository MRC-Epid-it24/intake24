import {
  countDistanceViolations,
  countOrderViolations,
} from '@intake24/api/food-index/match-quality-helpers';

describe('Match quality helpers', () => {
  describe('Order violations', () => {
    it('Empty input', () => {
      const input: number[] = [];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('Case 1', () => {
      const input = [1, 2, 3, 4];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('Case 2', () => {
      const input = [2, 1, 3, 4];

      expect(countOrderViolations(input)).toEqual(2);
    });

    it('Case 3', () => {
      const input = [4, 3, 2, 1];

      expect(countOrderViolations(input)).toEqual(12);
    });

    it('Case 4', () => {
      const input = [1, 1, 1, 1];

      expect(countOrderViolations(input)).toEqual(0);
    });

    it('Case 5', () => {
      const input = [1];

      expect(countOrderViolations(input)).toEqual(0);
    });
  });

  describe('Distance violations', () => {
    it('Empty input', () => {
      const input: number[] = [];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('Case 1', () => {
      const input = [1, 2, 3, 4];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('Case 2', () => {
      const input = [1];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('Case 3', () => {
      const input = [4, 3, 2, 1];

      expect(countDistanceViolations(input)).toEqual(0);
    });

    it('Case 4', () => {
      const input = [2, 4, 6, 8];

      expect(countDistanceViolations(input)).toEqual(3);
    });

    it('Case 5', () => {
      const input = [10, 2, 8];

      expect(countDistanceViolations(input)).toEqual(12);
    });
  });
});
