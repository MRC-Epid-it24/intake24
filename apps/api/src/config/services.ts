import type { EmbeddingConfig } from '@intake24/api/services/ai';
import type { CaptchaProvider } from '@intake24/common/security';
import { isCaptchaProvider } from '@intake24/common/security';

export type Captcha = {
  provider: CaptchaProvider | null;
  secret: string;
};

export type WebPush = {
  subject: string;
  publicKey: string;
  privateKey: string;
};

export type ServicesConfig = {
  captcha: Captcha;
  webPush: WebPush;
  embedding: EmbeddingConfig;
};

const provider = process.env.CAPTCHA_PROVIDER;
if (provider && !isCaptchaProvider(provider))
  throw new Error('Invalid Captcha provider');

const servicesConfig: ServicesConfig = {
  captcha: {
    provider: isCaptchaProvider(provider) ? provider : null,
    secret: process.env.CAPTCHA_SECRET ?? '',
  },
  webPush: {
    subject: process.env.WEBPUSH_SUBJECT ?? '',
    publicKey: process.env.WEBPUSH_PUBLIC_KEY ?? '',
    privateKey: process.env.WEBPUSH_PRIVATE_KEY ?? '',
  },
  embedding: {
    enabled: process.env.OPENAI_EMBEDDING_ENABLED === 'true',
    apiKey: process.env.OPENAI_API_KEY ?? '',
    model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    maxRequestsPerMinute: Number.parseInt(process.env.OPENAI_MAX_REQUESTS_PER_MINUTE ?? '5000', 10),
    maxTokensPerMinute: Number.parseInt(process.env.OPENAI_MAX_TOKENS_PER_MINUTE ?? '2000000', 10),
    batchSize: Number.parseInt(process.env.OPENAI_EMBEDDING_BATCH_SIZE ?? '100', 10),
  },
};

export default servicesConfig;
