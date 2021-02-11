/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import { Request } from 'express';
import { isObject } from 'lodash';
import { FindOptions as BaseFindOptions, Op, CountOptions as BaseCountOptions } from 'sequelize';
import { Model as BaseModel } from 'sequelize-typescript';
import { Readable } from 'stream';
import { Pagination, PaginationMeta } from '@common/types/models';

export interface PaginateOptions<TAttributes = any> extends BaseFindOptions<TAttributes> {
  req: Request;
  columns?: string[];
  transform?: (item: any) => any;
}

// Sequelize options not indexable
export interface CountOptions<TAttributes = any> extends BaseCountOptions<TAttributes> {
  [key: string]: any;
}

export interface FindOptions<TAttributes = any> extends BaseFindOptions<TAttributes> {
  [key: string]: any;
}

export interface StreamFindOptions<TAttributes = any> extends FindOptions<TAttributes> {
  batchSize?: number;
}

export type ModelCtor<M extends Model = Model> = typeof Model & { new (): M };
export type ModelStatic<M extends Model = Model> = { new (): M };

export default abstract class Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes
> extends BaseModel<TModelAttributes, TCreationAttributes> {
  /**
   * Paginate results of Model.findAll
   *
   * @static
   * @template R
   * @template M
   * @param {ModelCtor<R extends Model ? R : Model>} this
   * @param {Paginate} { req, columns = [], transform, ...params }
   * @returns {Promise<Pagination<R>>}
   * @memberof Model
   */
  public static async paginate<R = Model>(
    this: ModelCtor<R extends Model ? R : Model>,
    { req, columns = [], transform, ...params }: PaginateOptions
  ): Promise<Pagination<R>> {
    const { search, sort } = req.query;
    let { page = 1, limit = 50 } = req.query;
    page = page as number;
    limit = limit as number;

    const offset = limit * (page - 1);
    const options: FindOptions = { limit, offset, ...params };

    if (search && columns.length) {
      const operation =
        this.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const operations = columns.map((column) => ({ [column]: operation }));
      options.where = { [Op.or]: operations };
    }

    const countOptions = Object.keys(options).reduce((acc, key) => {
      if (!['order', 'attributes', 'limit', 'offset'].includes(key)) {
        acc[key] = options[key];
      }
      return acc;
    }, {} as CountOptions);

    let total = await this.unscoped().count(countOptions);

    // FIXME: improve type-check
    if (isObject(total) && 'group' in options) {
      total = (total as any).length;
    }

    if (sort && typeof sort === 'string') {
      const [column, order] = sort.split('|');
      options.order = [[column, order]];
    }

    const records = await this.findAll(options);

    const data = (transform ? records.map(transform) : records) as R[];

    const meta: PaginationMeta = {
      from: offset + 1,
      lastPage: Math.ceil(total / limit),
      page,
      path: '',
      limit,
      to: offset + limit,
      total,
    };

    return { data, meta };
  }

  /**
   * Batch-like stream helpers
   * based on https://github.com/nkovalenko93/sequelize-stream
   * and adopted for TS codebase
   */

  /**
   * Helper for streamed Model.findAll
   *
   * @static
   * @template M
   * @param {ModelCtor<M>} this
   * @param {Readable} inputStream
   * @param {StreamFindOptions} {}
   * @returns {Promise<void>}
   * @memberof Model
   */
  public static async performSearch<M extends Model<M>>(
    this: ModelCtor<M>,
    inputStream: Readable,
    { batchSize = 100, limit, offset: startOffset = 0, ...params }: StreamFindOptions
  ): Promise<void> {
    try {
      const max = limit ?? (await this.count(params));

      const offsets = [];
      let start = startOffset;

      while (start < max) {
        offsets.push(start);
        start += batchSize;
      }

      for (const offset of offsets) {
        const difference = batchSize + offset - max;
        const items = await this.findAll<M>({
          ...params,
          offset,
          limit: difference > 0 ? batchSize - difference : batchSize,
        });
        inputStream.push(JSON.stringify(items));
      }

      inputStream.push(null);
    } catch (err) {
      inputStream.destroy(err);
    }
  }

  /**
   * Streamed Model.findAll
   *
   * @static
   * @template M
   * @param {ModelCtor<M>} this
   * @param {StreamFindOptions} [options={}]
   * @returns {Readable}
   * @memberof Model
   */
  public static findAllWithStream<M extends Model<M>>(
    this: ModelCtor<M>,
    options: StreamFindOptions = {}
  ): Readable {
    const inputStream = new Readable({
      // objectMode: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      read() {},
    });
    this.performSearch(inputStream, options);

    return inputStream;
  }
}
