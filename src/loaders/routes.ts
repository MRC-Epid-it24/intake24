import routes from '@/routes';
import { AppLoader } from './loader';

export default async ({ app }: AppLoader): Promise<void> => {
  // Mount routes
  routes({ app });
};
