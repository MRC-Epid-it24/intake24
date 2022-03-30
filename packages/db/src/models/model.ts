/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import { CountOptions, FindOptions, Op } from 'sequelize';
import { Model as BaseModel } from 'sequelize-typescript';
import { Readable } from 'stream';
import { Pagination, PaginationMeta } from '@intake24/common/types/models';

export type PaginateQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export interface PaginateOptions<TAttributes = any> extends FindOptions<TAttributes> {
  query: PaginateQuery;
  columns?: string[];
  transform?: (item: any) => any;
}

// Sequelize options not indexable
export interface BaseCountOptions<TAttributes = any> extends CountOptions<TAttributes> {
  [key: string]: any;
}

export interface BaseFindOptions<TAttributes = any> extends FindOptions<TAttributes> {
  [key: string]: any;
}

export interface StreamFindOptions<TAttributes = any> extends FindOptions<TAttributes> {
  batchSize?: number;
}

export type BaseModelCtor<M extends Model = Model> = typeof Model & { new (): M };
export type BaseModelStatic<M extends Model = Model> = { new (): M };

export default class Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes
> extends BaseModel<TModelAttributes, TCreationAttributes> {
  /**
   * Paginate results of Model.findAll
   *
   * @static
   * @template R
   * @template M
   * @param {BaseModelStatic<R extends Model ? R : Model>} this
   * @param {Paginate} { req, columns = [], transform, ...params }
   * @returns {Promise<Pagination<R>>}
   * @memberof Model
   */
  public static async paginate<R = Model>(
    this: BaseModelStatic<R extends Model ? R : Model>,
    { query, columns = [], transform, ...params }: PaginateOptions
  ): Promise<Pagination<R>> {
    const { page = 1, limit = 50, sort, search } = query;

    const offset = limit * (page - 1);
    const options: BaseFindOptions = { limit, offset, ...params };

    // TODO: fix with sequelize types
    const model = this as BaseModelCtor<R extends Model ? R : Model>;

    if (search && columns.length) {
      const operation =
        model.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const operations = columns.map((column) => ({ [column]: operation }));
      options.where = { ...options.where, [Op.or]: operations };
    }

    const countOptions = Object.keys(options).reduce<BaseCountOptions>((acc, key) => {
      if (!['order', 'attributes', 'limit', 'offset'].includes(key)) {
        acc[key] = options[key];
      }
      return acc;
    }, {});

    const total = await model.unscoped().count(countOptions);

    if (sort && typeof sort === 'string') {
      const [column, order] = sort.split('|');
      options.order = [[column, order]];
    }

    const records = await model.findAll(options);

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
   * @param {BaseModelCtor<M>} this
   * @param {Readable} inputStream
   * @param {StreamFindOptions<M['_attributes']>} options
   * @returns {Promise<void>}
   * @memberof Model
   */
  public static async performSearch<M extends Model<M>>(
    this: BaseModelCtor<M>,
    inputStream: Readable,
    options: StreamFindOptions<M['_attributes']>
  ): Promise<void> {
    const { batchSize = 100, limit, offset: startOffset = 0, ...params } = options;

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
      inputStream.destroy(err instanceof Error ? err : undefined);
    }
  }

  /**
   * Streamed Model.findAll
   *
   * @static
   * @template M
   * @param {BaseModelStatic<M>} this
   * @param {StreamFindOptions<M['_attributes']>} [options={}]
   * @returns {Readable}
   * @memberof Model
   */
  public static findAllWithStream<M extends Model = Model>(
    this: BaseModelStatic<M>,
    options: StreamFindOptions<M['_attributes']> = {}
  ): Readable {
    // TODO: fix with sequelize types
    const model = this as BaseModelCtor<M>;

    const inputStream = new Readable({
      // objectMode: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      read() {},
    });
    model.performSearch(inputStream, options);

    return inputStream;
  }
}
