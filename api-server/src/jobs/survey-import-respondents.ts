import { Job } from 'bullmq';
import { parse } from 'fast-csv';
import fs from 'fs-extra';
import path from 'path';
import type { CustomField, SurveyImportRespondentsParams } from '@common/types';
import { User, UserSurveyAlias } from '@/db/models/system';
import type { IoC } from '@/ioc';
import BaseJob from './job';

export type CSVRow = {
  username: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: string | undefined;
};

const requiredFields = ['username', 'password'];

export default class SurveyImportRespondents extends BaseJob<SurveyImportRespondentsParams> {
  readonly name = 'SurveyImportRespondents';

  private readonly surveyService;

  private file!: string;

  private content: CSVRow[] = [];

  constructor({ logger, surveyService }: Pick<IoC, 'logger' | 'surveyService'>) {
    super({ logger });

    this.surveyService = surveyService;
  }

  /**
  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.file = path.resolve(this.params.file);

    this.logger.debug('Job started.');

    const fileExists = await fs.pathExists(this.file);
    if (!fileExists) throw new Error(`Missing file (${this.file}).`);

    await this.validate();

    await this.import();

    this.logger.debug('Job finished.');
  }

  /**
   * Read CSV file and validate in chunks
   *
   * @private
   * @param {number} [chunk=100]
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
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

  /**
   * Chunk validator. It validates:
   * - presence of required fields
   * - username / survey alias uniqueness within survey
   * - email uniqueness within system
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
  private async validateChunk(): Promise<void> {
    if (!this.content.length) return;

    const csvFields = Object.keys(this.content[0]);

    // Check for presence of required fields
    if (requiredFields.some((field) => !csvFields.includes(field)))
      throw new Error(`Missing some of the required fields (${requiredFields.join(',')}).`);

    const userName = this.content.map((item) => item.username);
    const { surveyId } = this.params;

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

  /**
   * Read CSV file and import in chunks
   *
   * @private
   * @param {number} [chunk=100]
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
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

  /**
   * Chunk importer
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
  private async importChunk(): Promise<void> {
    if (!this.content.length) return;

    const records = this.content.map((item) => {
      const { username, password, name, email, phone, ...rest } = item;

      const customFields = Object.keys(rest).reduce<CustomField[]>((acc, key) => {
        const value = rest[key];
        if (value) acc.push({ name: key, value });

        return acc;
      }, []);

      return {
        userName: username,
        password,
        name,
        email,
        phone,
        customFields,
      };
    });

    await this.surveyService.createRespondents(this.params.surveyId, records);

    this.content = [];
  }
}
