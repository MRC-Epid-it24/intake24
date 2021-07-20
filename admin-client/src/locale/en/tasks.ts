import { LocaleMessageObject } from 'vue-i18n';

const tasks: LocaleMessageObject = {
  _: 'Task',
  index: 'Tasks',
  show: 'Task detail',
  new: 'New task',
  create: 'Add task',
  edit: 'Edit task',
  delete: 'Delete task',
  none: 'No task',
  cron: 'CRON',
  invalidCron: 'Invalid CRON entry',
  schedule: 'Schedule',
  job: 'Job',
  run: {
    _: 'Trigger job',
    confirm: 'Push the job to the queue',
    next: 'Next job run',
  },
  params: 'Task parameters',
  bullJob: 'Bull job (Queue entry)',
  file: 'File location',
};

export default tasks;
