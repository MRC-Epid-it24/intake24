import db from '@/db';
import foodIndex from '@/food-index';
import mailer from '@/services/mailer';

export default async (): Promise<void> => {
  // Databases
  await db.init();

  // Mailer
  mailer.init();

  // Food indexing and searching
  await foodIndex.init();
};
