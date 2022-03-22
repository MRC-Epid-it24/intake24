import foodIndex from '@intake24/api/food-index';
import ioc from '@intake24/api/ioc';

export default async (): Promise<void> => {
  // Cache
  ioc.cradle.cache.init();

  // Databases
  await ioc.cradle.db.init();

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
};
