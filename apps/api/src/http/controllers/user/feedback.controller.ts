import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { User, UserSurveyAlias } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { getSurveyUrl } from '@intake24/api/util';
import type { Controller } from '../controller';

export type UserFeedbackController = Controller<'download'>;

export default ({ appConfig }: Pick<IoC, 'appConfig'>): UserFeedbackController => {
  const download = async (
    req: Request<any, any, any, { surveyId: string }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { surveyId } = req.query;
    const { id: userId } = req.user as User;

    /*
     * TODO: this does not cover scenarios of multiple survey aliases or email logins with no aliases
     * - decode Bearer to get correct login path
     * - set refresh cookie and save round trip for login
     * - extract logic and allow PDF generation from admin tool
     */
    const alias = await UserSurveyAlias.findOne({ where: { surveyId, userId } });
    if (!alias) throw new NotFoundError();

    const { urlAuthToken } = alias;
    const { base, survey } = appConfig.urls;
    const baseUrl = getSurveyUrl(base, survey);
    const url = `${baseUrl}/${surveyId}/feedback?token=${urlAuthToken}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.createPDFStream({
      format: 'a4',
      displayHeaderFooter: true,
      printBackground: true,
    });

    const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);
    // res.set('content-length', pdfBuffer.length.toString());
    pdfBuffer.pipe(res);

    pdfBuffer
      .on('end', async () => {
        await browser.close();
      })
      .on('error', async () => {
        await browser.close();
      });
  };

  return { download };
};
