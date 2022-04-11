import puppeteer from 'puppeteer';

export default class FeedbackPdfGenerator {
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  async loadFeedback() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(this.url, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    return { browser, page };
  }

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

  async getPdfStream() {
    const { browser, page } = await this.loadFeedback();

    const pdfBuffer = await page.createPDFStream({
      format: 'a4',
      displayHeaderFooter: true,
      printBackground: true,
    });

    pdfBuffer
      .on('end', async () => {
        await browser.close();
      })
      .on('error', async () => {
        await browser.close();
      });

    return pdfBuffer;
  }
}
