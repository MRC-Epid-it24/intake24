import { parse } from 'fast-csv';
import fs from 'fs-extra';
import path from 'path';
import { User, UserSurveyAlias } from '@/db/models/system';
import type { IoC } from '@/ioc';
import { Job, JobData, JobType } from './job';

export type ImportSurveyRespondentsData = {
  surveyId: string;
  file: string;
};

export type CSVRow = {
  username: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
};

const requiredFields = ['username', 'password'];

export default class ImportSurveyRespondents implements Job {
  public readonly name: JobType = 'ImportSurveyRespondents';

  private data!: ImportSurveyRespondentsData;

  private logger;

  private surveyService;

  private file!: string;

  private content: CSVRow[] = [];

  constructor({ logger, surveyService }: IoC) {
    this.logger = logger;
    this.surveyService = surveyService;
  }

  /**
   * Run the job
   *
   * @return Promise<void>
   */
  public async run({ data }: JobData<ImportSurveyRespondentsData>): Promise<void> {
    this.data = data;
    this.file = path.resolve(data.file);

    this.logger.debug(`Job ${this.name} started.`);

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    await this.validate();

    await this.import();

    this.logger.debug(`Job ${this.name} finished.`);
  }

  private async validate(chunk = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(parse({ headers: true, trim: true }));

      stream
        .on('data', (row: CSVRow) => {
          this.content.push(row);

          if (chunk > 0 && this.content.length === chunk) {
            stream.pause();
            this.validateChunk()
              .then(() => {
                if (stream.destroyed) resolve();
                else stream.resume();
              })
              .catch((err) => {
                stream.destroy(err);
                reject(err);
              });
          }
        })
        .on('end', (records: number) => {
          if (records % chunk === 0) return;

          this.validateChunk()
            .then(() => resolve())
            .catch((err) => {
              stream.destroy(err);
              reject(err);
            });
        })
        .on('error', (err) => reject(err));
    });
  }

  private async validateChunk(): Promise<void> {
    if (!this.content.length) return;

    const csvFields = Object.keys(this.content[0]);
    if (requiredFields.some((field) => !csvFields.includes(field)))
      throw new Error(`Missing required fields, 'username' or 'password'.`);

    const userName = this.content.map((item) => item.username);
    const { surveyId } = this.data;

    // Check for unique aliases within survey
    const aliases = await UserSurveyAlias.findAll({ where: { surveyId, userName } });
    if (aliases.length) {
      const existingAliases = aliases.map((alias) => alias.userName);
      throw new Error(`Following usernames already exist in survey: ${existingAliases.join(', ')}`);
    }

    // Check for unique emails within system
    const email = this.content.filter((item) => item.email).map((item) => item.email) as string[];
    if (email.length) {
      const users = await User.findAll({ where: { email } });

      if (users.length) {
        const existingUsers = users.map((user) => user.email);
        throw new Error(`Following emails already exist in system: ${existingUsers.join(', ')}`);
      }
    }

    this.content = [];
  }

  private async import(chunk = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.file).pipe(parse({ headers: true, trim: true }));

      stream
        .on('data', (row: CSVRow) => {
          this.content.push(row);

          if (chunk > 0 && this.content.length === chunk) {
            stream.pause();
            this.importChunk()
              .then(() => {
                if (stream.destroyed) resolve();
                else stream.resume();
              })
              .catch((err) => {
                stream.destroy(err);
                reject(err);
              });
          }
        })
        .on('end', (records: number) => {
          if (records % chunk === 0) return;

          this.importChunk()
            .then(() => resolve())
            .catch((err) => {
              stream.destroy(err);
              reject(err);
            });
        })
        .on('error', (err) => reject(err));
    });
  }

  private async importChunk(): Promise<void> {
    if (!this.content.length) return;

    for (const record of this.content) {
      const { username, ...rest } = record;
      await this.surveyService.createRespondent(this.data.surveyId, {
        userName: username,
        ...rest,
      });
    }

    this.content = [];
  }
}
