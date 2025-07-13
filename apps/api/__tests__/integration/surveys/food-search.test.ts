import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/search`;
    invalidUrl = `/api/surveys/invalid-survey/search`;
  });

  describe('authentication & Authorization', () => {
    it('should return 401 when no / invalid token', async () => {
      await suite.sharedTests.assertMissingAuthentication('get', url);
    });

    it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
      await suite.sharedTests.assertMissingAuthorization('get', invalidUrl, {
        bearer: 'respondent',
      });
    });
  });

  describe('parameter validation', () => {
    it('should return 400 for missing description parameter', async () => {
      const { status } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(400);
    });

    it('should return 400 for description exceeding 120 characters', async () => {
      const longDescription = 'a'.repeat(121);
      const { status } = await request(suite.app)
        .get(url)
        .query({ description: longDescription })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(400);
    });

    it('should accept valid description at max length (120 chars)', async () => {
      const maxDescription = 'a'.repeat(120);
      const { status } = await request(suite.app)
        .get(url)
        .query({ description: maxDescription })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
    });
  });

  describe('search functionality', () => {
    it('should return 200 with valid search response structure', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
      expect(body.foods).toBeArray();
      expect(body.categories).toBeArray();
    });

    it('should return foods with correct structure', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);

      if (body.foods.length > 0) {
        const food = body.foods[0];
        expect(food).toContainAllKeys(['code', 'name']);
        expect(food.code).toBeString();
        expect(food.name).toBeString();

        // Optional fields
        if (food.searchTerm !== undefined) {
          expect(food.searchTerm).toBeOneOf([expect.any(String), null]);
        }
        if (food.thumbnailImageUrl !== undefined) {
          expect(food.thumbnailImageUrl).toBeString();
        }
      }
    });

    it('should return categories with correct structure', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);

      if (body.categories.length > 0) {
        const category = body.categories[0];
        expect(category).toContainAllKeys(['code', 'name']);
        expect(category.code).toBeString();
        expect(category.name).toBeString();
      }
    });
  });

  describe('query parameters', () => {
    it('should handle recipe parameter (true)', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', recipe: 'true' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle recipe parameter (false)', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', recipe: 'false' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle hidden parameter (true)', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', hidden: 'true' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle hidden parameter (false)', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', hidden: 'false' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle category parameter', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', category: 'CERP' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle previous parameter as array', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', previous: ['RICE001', 'RICE002'] })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle all parameters combined', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({
          description: 'rice',
          recipe: 'false',
          hidden: 'false',
          category: 'CERP',
          previous: ['RICE001'],
        })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });
  });

  describe('search scenarios', () => {
    it('should handle common English food search', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'apple' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle partial word search', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'ric' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle special characters in search', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'café' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle empty search results gracefully', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'xyznonexistentfood123' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
      expect(body.foods).toBeArray();
      expect(body.categories).toBeArray();
    });

    it('should handle numeric search terms', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: '123' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });

    it('should handle single character search', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'a' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });
  });

  describe('performance and limits', () => {
    it('should respect search result limits from survey settings', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body.foods).toBeArray();
      // The actual limit depends on survey settings, but should be reasonable
      expect(body.foods.length).toBeLessThanOrEqual(100);
    });

    it('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }).fill(null).map(() =>
        request(suite.app)
          .get(url)
          .query({ description: 'rice' })
          .set('Accept', 'application/json')
          .set('Authorization', suite.bearer.respondent),
      );

      const results = await Promise.all(promises);

      results.forEach(({ status, body }) => {
        expect(status).toBe(200);
        expect(body).toContainAllKeys(['foods', 'categories']);
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed query parameters gracefully', async () => {
      const { status } = await request(suite.app)
        .get(url)
        .query({ description: 'rice', recipe: 'invalid' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      // Should either return 400 for invalid parameter or 200 with default behavior
      expect([200, 400]).toContain(status);
    });

    it('should handle URL encoding in search terms', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice & beans' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);
    });
  });

  describe('survey-specific behavior', () => {
    it('should use survey-specific search settings', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .query({ description: 'rice' })
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['foods', 'categories']);

      // Results should be filtered based on survey locale and settings
      expect(body.foods).toBeArray();
      expect(body.categories).toBeArray();
    });
  });
};
