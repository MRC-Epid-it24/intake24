import { Readable } from 'node:stream';

import type { CookieParam } from 'puppeteer';
import puppeteer from 'puppeteer';

export default class FeedbackPdfGenerator {
  readonly url;
  readonly refreshCookie;

  constructor(url: string, cookie: CookieParam) {
    this.url = url;
    this.refreshCookie = cookie;
  }

  async loadFeedback() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setCookie(this.refreshCookie);
    await page.emulateMediaType('print');
    await page.goto(this.url, { waitUntil: 'networkidle0' });

    return { browser, page };
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
