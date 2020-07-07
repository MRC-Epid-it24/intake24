import db from '@/db';
import foodIndex from '@/food-index';

export default async (): Promise<void> => {
  // Databases
  await db.init();

  // Food indexing and searching
  await foodIndex.init();
};
