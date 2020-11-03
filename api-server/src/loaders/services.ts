import db from '@/db';
import foodIndex from '@/food-index';
import mailer from '@/services/mailer';
import scheduler from '@/services/scheduler';

export default async (): Promise<void> => {
  // Databases
  await db.init();

  // Mailer
  mailer.init();

  // Scheduler
  await scheduler.init();

  // Food indexing and searching
  await foodIndex.init();
};
