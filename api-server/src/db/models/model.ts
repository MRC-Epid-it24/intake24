import { isObject } from 'lodash';
import { FindOptions as BaseFindOptions, Op, CountOptions as BaseCountOptions } from 'sequelize';
import { Model as BaseModel } from 'sequelize-typescript';
import { Request } from 'express';

export interface Paginate extends BaseFindOptions {
  req: Request;
  columns?: string[];
  transform?: (item: any) => any;
  [key: string]: any;
}

export interface Pagination<R = Model> {
  data: R[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  from: number;
  lastPage: number;
  page: number;
  path: string;
  limit: number;
  to: number;
  total: number;
}

// Sequelize options not indexable
export interface CountOptions extends BaseCountOptions {
  [key: string]: any;
}

export interface FindOptions extends BaseFindOptions {
  [key: string]: any;
}

export class Model<T = any, T2 = any> extends BaseModel<T, T2> {
  public static async paginate<R>({
    req,
    columns = [],
    transform,
    ...params
  }: Paginate): Promise<Pagination<R>> {
    // TODO: augment new core.Query interface in express subpackage
    const { search, sort, ...query } = req.query;
    let { page = 1, limit = 50 } = req.query;
    page = page as number;
    limit = limit as number;

    const options = {
      limit,
      offset: limit * (page - 1),
      ...params,
    } as FindOptions;

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

    // TODO: implement server-side sorting
    // if (params.order) options.order = params.order;

    const records = await this.findAll(options);

    const data = (transform ? records.map(transform) : records) as R[];

    const meta: PaginationMeta = {
      from: (options.offset as number) + 1,
      lastPage: Math.ceil(total / limit),
      page,
      path: '',
      limit,
      to: (options.offset as number) + limit,
      total,
    };

    const pagination: Pagination<R> = {
      data,
      meta,
    };

    return pagination;
  }
}

export default Model;
