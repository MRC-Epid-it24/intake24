import { z } from 'zod';

export const pdfConfig = z.object({
  puppeteer: z.object({
    headless: z.union([z.literal('shell'), z.boolean()]).default(true),
    netLogDir: z.string().optional(),
  }),
});
export type PdfConfig = z.infer<typeof pdfConfig>;
export type PuppeteerOptions = PdfConfig['puppeteer'];

export default pdfConfig.parse({
  puppeteer: {
    headless: process.env.PUPPETEER_HEADLESS === 'true' ? true : process.env.PUPPETEER_HEADLESS,
    netLogDir: process.env.PUPPETEER_NETLOG_DIR,
  },
});
