import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/errors/app-error.js';
import type { Task, TaskPriority } from '../../domain/entities/task.js';
import type {
  TaskListQuery,
  TaskListResult,
  TaskRepository,
} from '../../domain/repositories/task.repository.js';

export interface CreateTaskInput {
  title: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  list(query: TaskListQuery): Promise<TaskListResult> {
    return this.repository.findMany(query);
  }

  async get(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const now = new Date();

    const task: Task = {
      id: randomUUID(),
      title: input.title.trim(),
      completed: false,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const current = await this.get(id);

    const updated: Task = {
      ...current,
      ...input,
      title: input.title?.trim() ?? current.title,
      updatedAt: new Date(),
    };

    return this.repository.update(updated);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
  }
}
