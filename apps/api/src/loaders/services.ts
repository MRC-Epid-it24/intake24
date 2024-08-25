import type { Ops } from '@intake24/api/app';
import ioc from '@intake24/api/ioc';

async function exitSignalHandler() {
  /*
   * Gracefully shut down workers
   * https://docs.bullmq.io/guide/going-to-production#gracefully-shut-down-workers
   */
  await ioc.cradle.scheduler.closeWorkers();

  await Promise.all([
    ioc.cradle.db.close(),
    ioc.cradle.kyselyDb.close(),
  ]);

  process.exit();
}

export default async (ops: Ops): Promise<void> => {
  // Cache
  ioc.cradle.cache.init();

  // Databases
  await Promise.all([
    ioc.cradle.db.init(),
    ioc.cradle.kyselyDb.init(),
  ]);
  if (ops.config.app.env === 'test')
    await ioc.cradle.db.sync(true);

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
  await ioc.cradle.foodIndex.init();

  // i18n translations
  await ioc.cradle.i18nStore.init();

  // Redis indexing
  ioc.cradle.reindexingPublisherService.init();
  ioc.cradle.reindexingSubscriberService.init();
  await ioc.cradle.reindexingSubscriberService.subscribeToChannel();

  // Exit signal handlers
  process.on('SIGINT', exitSignalHandler);
  process.on('SIGTERM', exitSignalHandler);
  process.on('SIGQUIT', exitSignalHandler);
};
