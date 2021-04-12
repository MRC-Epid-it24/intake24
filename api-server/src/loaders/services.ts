import foodIndex from '@/food-index';
import ioc from '@/ioc';

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

  // Scheduler
  await ioc.cradle.scheduler.init();

  // Food indexing and searching
  await foodIndex.init();
};
