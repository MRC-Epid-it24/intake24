import foodIndex from '@/food-index';
import ioc from '@/ioc';
import type { Ops } from '@/app';

export default async (ops: Ops): Promise<void> => {
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
  /* TODO / FIX-ME
   * foodIndex disabled in test environment for now
   * need to implement DB connection closure
   * other test suite hangs and needs to be force-closed
   */
  if (ops.config.app.env !== 'test') await foodIndex.init();
};
