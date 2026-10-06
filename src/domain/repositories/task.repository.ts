import type { Task } from '../entities/task.js';

export interface TaskListQuery {
  page: number;
  limit: number;
  completed?: boolean;
}

export interface TaskListResult {
  items: Task[];
  total: number;
}

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findMany(query: TaskListQuery): Promise<TaskListResult>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
}
