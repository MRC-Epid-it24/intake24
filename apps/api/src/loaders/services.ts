import type { Ops } from '@intake24/api/app';
import foodIndex from '@intake24/api/food-index';
import ioc from '@intake24/api/ioc';

export default async (ops: Ops): Promise<void> => {
  // Cache
  ioc.cradle.cache.init();

  // Databases
  ioc.cradle.db.init();
  if (ops.config.app.env === 'test') await ioc.cradle.db.sync(true);
  ioc.cradle.kyselyDb.init();

  // Local filesystem
  await ioc.cradle.filesystem.init();

  // Mailer
  ioc.cradle.mailer.init();

  // Pusher
  await ioc.cradle.pusher.init();

  // Rate limiter
  ioc.cradle.rateLimiter.init();

  // Scheduler
  await ioc.cradle.scheduler.init();

  // Food indexing and searching
  await foodIndex.init();

  // i18n translations
  await ioc.cradle.i18nStore.init();
};
