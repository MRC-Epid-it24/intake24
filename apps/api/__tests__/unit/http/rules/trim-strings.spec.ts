import { trimStrings } from '@intake24/common/rules';

describe('Input trim string middleware', () => {
  it('should trim string and replace empty with nulls', () => {
    expect(trimStrings(' to be trimmed ')).toEqual('to be trimmed');
  });

  it('should trim white spaces string to null', () => {
    expect(trimStrings('  ')).toEqual(null);
  });

  it('should trim empty string to null', () => {
    expect(trimStrings('')).toEqual(null);
  });
});
