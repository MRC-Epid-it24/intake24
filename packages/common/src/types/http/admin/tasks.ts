import type { RepeatableBullJob } from '../../jobs';
import type { Pagination, TaskAttributes, TaskCreationAttributes } from '../../models';

export type TaskRequest = TaskCreationAttributes;

export type CreateTaskRequest = TaskRequest;

export type UpdateTaskRequest = TaskRequest;

export type TasksResponse = Pagination<TaskAttributes>;

export interface TaskEntry extends TaskAttributes {
  bullJob?: RepeatableBullJob;
}

export type TaskRefs = {
  jobs: string[];
};
