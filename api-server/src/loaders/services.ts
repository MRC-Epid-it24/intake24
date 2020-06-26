import db from '@/db';

export default async (): Promise<void> => {
  // Databases
  await db.init();
};
