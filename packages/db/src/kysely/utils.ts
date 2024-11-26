import type { SelectQueryBuilder, Simplify, StringReference } from 'kysely';
import { sql } from 'kysely';

import type { Pagination, PaginationMeta } from '@intake24/common/types/http';
import type { PaginateQuery } from '@intake24/db';

export async function executeWithPagination<DB, TB extends keyof DB, O>(query: SelectQueryBuilder<DB, TB, O>, searchColumns: StringReference<DB, TB>[], sortColumns: StringReference<DB, TB>[], paginateQuery: PaginateQuery): Promise<Pagination<Simplify<O>>> {
  const { page = 1, limit = 50, sort, search } = paginateQuery;

  const offset = limit * (page - 1);

  let modifiedQuery = query.offset(offset).limit(limit);

  if (search && typeof search === 'string' && searchColumns.length > 0) {
    modifiedQuery = modifiedQuery.where(eb =>
      eb.or(
        searchColumns.map(columnRef =>
          eb(sql`lower(cast(${sql.ref(columnRef)} as text))`, 'like', `%${search.toLowerCase()}%`),
        ),
      ),
    );
  }

  if (sort && typeof sort === 'string') {
    const [column, order] = sort.split('|');
    const sortColumn = sortColumns.find(refExpr => refExpr === column);
    if (sortColumn !== undefined)
      modifiedQuery = modifiedQuery.orderBy(sortColumn, order === 'desc' ? 'desc' : 'asc');
  }

  const countQuery = modifiedQuery
    .clearSelect()
    .clearLimit()
    .clearOffset()
    .select(eb => eb.fn.countAll<string>().as('total'));

  const total = Number.parseInt(((await countQuery.executeTakeFirstOrThrow()) as { total: string }).total, 10);

  const data = await modifiedQuery.execute();

  const meta: PaginationMeta = {
    from: offset + 1,
    lastPage: Math.ceil(total / limit),
    page,
    path: '',
    limit,
    to: offset + limit,
    total,
  };

  return {
    data,
    meta,
  };
}
