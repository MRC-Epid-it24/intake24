import { getFrontEndUrl } from '@intake24/api/util';

describe('getFrontEndUrl', () => {
  it('should concat relative URL and clean leading/trailing slashes', () => {
    expect(getFrontEndUrl('http://localhost:3100/', '/survey/')).toBe(
      'http://localhost:3100/survey'
    );
  });

  it('should use absolute frontend URL if provided and clean leading/trailing slashes', () => {
    expect(getFrontEndUrl('http://localhost:3100/', 'https://survey.example.com/')).toBe(
      'https://survey.example.com'
    );
  });

  it('should use override URL is provided and clean leading/trailing slashes', () => {
    expect(
      getFrontEndUrl(
        'http://localhost:3100/',
        'https://survey.example.com/',
        'https://override-survey.example.com/'
      )
    ).toBe('https://override-survey.example.com');
  });
});
