import { Readable } from 'node:stream';

import type { CookieParam } from 'puppeteer';
import puppeteer from 'puppeteer';

import { PuppeteerOptions } from '@intake24/api/config';

export default class FeedbackPdfGenerator {
  readonly url;
  readonly refreshCookie;
  readonly options;

  constructor(url: string, cookie: CookieParam, options: PuppeteerOptions) {
    this.url = url;
    this.refreshCookie = cookie;
    this.options = options;
  }

  async loadFeedback() {
    const args = [];

    if (this.options.lang)
      args.push(`--lang=${this.options.lang}`);

    const browser = await puppeteer.launch({ headless: this.options.headless, args });

    try {
      const page = await browser.newPage();
      await page.setCookie(this.refreshCookie);
      await page.emulateMediaType('print');
      await page.goto(this.url, { waitUntil: 'networkidle0' });

      return { browser, page };
    }
    catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Get PDf buffer
   *
   * @returns
   * @memberof FeedbackPdfGenerator
   */
  async getPdf() {
    const { browser, page } = await this.loadFeedback();

    const pdfBuffer = await page.pdf({
      format: 'a4',
      displayHeaderFooter: true,
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  }

  /**
   * Get PDF stream
   *
   * @returns
   * @memberof FeedbackPdfGenerator
   */
  async getPdfStream() {
    const { browser, page } = await this.loadFeedback();

    const pdfWebStream = await page.createPDFStream({
      format: 'a4',
      displayHeaderFooter: true,
      printBackground: true,
    });
    // @ts-expect-error types
    const pdfBuffer = Readable.fromWeb(pdfWebStream);

    pdfBuffer
      .on('end', async () => {
        await browser.close();
      })
      .on('error', async () => {
        await browser.close();
      });

    return pdfBuffer;
  }

  /**
   * Generate PDF file to disk
   *
   * @param {string} path
   * @memberof FeedbackPdfGenerator
   */
  async getPdfFile(path: string) {
    const { browser, page } = await this.loadFeedback();

    await page.pdf({
      path,
      format: 'a4',
      displayHeaderFooter: true,
      printBackground: true,
    });

    await browser.close();

    return path;
  }
}
