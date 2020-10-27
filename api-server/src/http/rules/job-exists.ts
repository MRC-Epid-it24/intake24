import jobs from '@/jobs';

export default (value: string): boolean => Object.keys(jobs).includes(value);
