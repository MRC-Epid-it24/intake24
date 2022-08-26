import { replaceParams } from '../../src';

describe('replace translation params', () => {
  it('should not replace placeholders when no parameters provided', () => {
    const result = replaceParams('This is number: {one}.');

    expect(result).toBe('This is number: {one}.');
  });

  it('should not replace placeholders when wrong parameters provided', () => {
    const result = replaceParams('This is number: {one}.', { two: 2 });

    expect(result).toBe('This is number: {one}.');
  });

  it('should replace placeholders', () => {
    const result = replaceParams('This is number: {one}{two}.', { one: 1, two: 2 });

    expect(result).toBe('This is number: 12.');
  });
});
