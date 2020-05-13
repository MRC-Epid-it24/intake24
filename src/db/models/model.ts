import { isObject } from 'lodash';
import { FindOptions as BaseFindOptions, Op, CountOptions as BaseCountOptions } from 'sequelize';
import { Model as BaseModel } from 'sequelize-typescript';
import { Request } from 'express';

export interface Paginate {
  req: Request;
  columns?: string[];
  [key: string]: any;
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

export interface PaginationLinks {
  lastPageUrl: string;
  nextPageUrl: string;
  prevPageUrl: string;
}

export interface Pagination {
  data: Model[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

// Sequelize options not indexable
export interface CountOptions extends BaseCountOptions {
  [key: string]: any;
}

export interface FindOptions extends BaseFindOptions {
  [key: string]: any;
}

export class Model<T = any, T2 = any> extends BaseModel<T, T2> {
  public static async paginate({ req, columns = [], ...params }: Paginate): Promise<Pagination> {
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
      const conds = columns.map((column) => ({ [column]: { [Op.substring]: search } }));
      options.where = { [Op.or]: conds };
    }

    const countOptions = Object.keys(options).reduce((acc, key) => {
      if (!['order', 'attributes', 'include', 'limit', 'offset'].includes(key)) {
        acc[key] = options[key];
      }
      return acc;
    }, {} as CountOptions);

    let total = await this.unscoped().count(countOptions);

    if (isObject(total) && 'group' in options) {
      total = (total as any).length;
    }

    // if (params.order) options.order = params.order;

    const data = await this.findAll(options);

    const meta: PaginationMeta = {
      from: (options.offset as number) + 1,
      lastPage: Math.ceil(total / limit),
      page,
      path: '',
      limit,
      to: (options.offset as number) + limit,
      total,
    };

    const links: PaginationLinks = {
      lastPageUrl: '',
      nextPageUrl: '',
      prevPageUrl: '',
    };

    return { data, meta, links };
  }
}

export default Model;
