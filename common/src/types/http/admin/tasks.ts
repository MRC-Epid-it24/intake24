import { Task, TaskCreateAttributes, Pagination } from '../../models';

export type TaskRequest = TaskCreateAttributes;

export type CreateTaskRequest = TaskRequest;

export type UpdateTaskRequest = TaskRequest;

export type TasksResponse = Pagination<Task>;

export type TaskEntry = Task;

export type TaskRefs = {
  jobs: string[];
};

export type TaskResponse = {
  data: TaskEntry;
  refs: TaskRefs;
};

export type CreateTaskResponse = Pick<TaskResponse, 'refs'>;

export type StoreTaskResponse = Pick<TaskResponse, 'data'>;
