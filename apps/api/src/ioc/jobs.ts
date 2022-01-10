import { asClass, AwilixContainer } from 'awilix';
import jobs, { Job } from '@intake24/api/jobs';

export default (container: AwilixContainer): void => {
  for (const [name, job] of Object.entries(jobs)) {
    container.register({ [name]: asClass<Job>(job) });
  }
};
