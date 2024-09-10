import { z } from 'zod';

export const pdfConfig = z.object({
  puppeteer: z.object({
    headless: z.union([z.literal('shell'), z.boolean()]).default(true),
    lang: z.string().optional(),
  }),
});
export type PdfConfig = z.infer<typeof pdfConfig>;
export type PuppeteerOptions = PdfConfig['puppeteer'];

export default pdfConfig.parse({
  puppeteer: {
    headless: process.env.PUPPETEER_HEADLESS === 'true' ? true : process.env.PUPPETEER_HEADLESS,
    lang: process.env.PUPPETEER_LANG,
  },
});
