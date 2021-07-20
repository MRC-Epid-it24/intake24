import { RepeatableBullJob } from '../../jobs';
import { TaskAttributes, TaskCreationAttributes, Pagination } from '../../models';

export type TaskRequest = TaskCreationAttributes;

export type CreateTaskRequest = TaskRequest;

export type UpdateTaskRequest = TaskRequest;

export type TasksResponse = Pagination<TaskAttributes>;

export type TaskEntry = TaskAttributes;

export type TaskRefs = {
  jobs: string[];
};

export type TaskResponse = {
  data: TaskEntry;
  bullJob?: RepeatableBullJob;
  refs: TaskRefs;
};

export type CreateTaskResponse = Pick<TaskResponse, 'refs'>;

export type StoreTaskResponse = Pick<TaskResponse, 'data'>;
