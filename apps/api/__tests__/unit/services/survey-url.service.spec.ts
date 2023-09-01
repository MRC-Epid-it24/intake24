import { surveyUrlService } from '@intake24/api/services';

describe('Survey Url service', () => {
  const urls = {
    base: 'https://example.com',
    admin: '/admin',
    survey: '/survey',
    images: '/images',
    docs: '/docs',
  };

  it('should return base frontend url', () => {
    const urlService = surveyUrlService(urls, 'survey-slug');

    const url = urlService.getBaseUrl();

    expect(url).toBe('https://example.com/survey');
  });

  it('should return survey authentication url #short', () => {
    const urlService = surveyUrlService(urls, 'survey-slug');

    const url = urlService.getSurveyUrl('surveyAuthToken');

    expect(url).toBe('https://example.com/survey/a/surveyAuthToken');
  });

  it('should return survey authentication url #long', () => {
    const urlService = surveyUrlService(urls, 'survey-slug');

    const url = urlService.getSurveyUrl('surveyAuthToken', true);

    expect(url).toBe('https://example.com/survey/survey-slug?auth=surveyAuthToken');
  });

  it('should return survey authentication url (override) #short', () => {
    const urlService = surveyUrlService(urls, 'survey-slug', 'https://override.com');

    const url = urlService.getSurveyUrl('surveyAuthToken');

    expect(url).toBe('https://override.com/a/surveyAuthToken');
  });

  it('should return survey authentication url (override) #long', () => {
    const urlService = surveyUrlService(urls, 'survey-slug', 'https://override.com');

    const url = urlService.getSurveyUrl('surveyAuthToken', true);

    expect(url).toBe('https://override.com/survey-slug?auth=surveyAuthToken');
  });

  it('should return feedback authentication url', () => {
    const urlService = surveyUrlService(urls, 'survey-slug');

    const url = urlService.getFeedbackUrl('feedbackAuthToken');

    expect(url).toBe('https://example.com/survey/survey-slug/feedback?auth=feedbackAuthToken');
  });

  it('should return feedback authentication url (override)', () => {
    const urlService = surveyUrlService(urls, 'survey-slug', 'https://override.com');

    const url = urlService.getFeedbackUrl('surveyAuthToken');

    expect(url).toBe('https://override.com/survey-slug/feedback?auth=surveyAuthToken');
  });
});
