import type { Pagination, TaskAttributes, TaskCreationAttributes } from '@intake24/db';

import type { RepeatableBullJob } from '../../jobs';

export type TaskRequest = TaskCreationAttributes;

export type CreateTaskRequest = TaskRequest;

export type UpdateTaskRequest = TaskRequest;

export type TasksResponse = Pagination<TaskAttributes>;

export interface TaskEntry extends TaskAttributes {
  bullJob?: RepeatableBullJob;
}

export type TaskRefs = {};
