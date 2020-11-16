import logger from '@/services/logger';
import type { JobData } from '@/services/queues/jobs-queue-handler';
import { Job, JobType } from './job';

export interface UploadSurveyRespondentsData {
  surveyId: number;
  file: string;
}

export default class UploadSurveyRespondents implements Job {
  public readonly name: JobType = 'UploadSurveyRespondents';

  private data: UploadSurveyRespondentsData;

  constructor({ data }: JobData<UploadSurveyRespondentsData>) {
    this.data = data;
  }

  /**
   * Run the job
   *
   * @return Promise<void>
   */
  public async run(): Promise<void> {
    logger.debug(`Job ${this.name} started.`);

    const wait = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 5000);
      });
    };

    await wait();

    logger.debug(`Job ${this.name} finished.`);
  }
}
