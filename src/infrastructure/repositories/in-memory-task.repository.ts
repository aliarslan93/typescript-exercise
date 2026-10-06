import type {
  TaskListQuery,
  TaskListResult,
  TaskRepository,
} from '../../domain/repositories/task.repository.js';
import type { Task } from '../../domain/entities/task.js';

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>();

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async findMany(query: TaskListQuery): Promise<TaskListResult> {
    const filtered = [...this.tasks.values()]
      .filter((task) =>
        query.completed === undefined ? true : task.completed === query.completed,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = (query.page - 1) * query.limit;

    return {
      items: filtered.slice(start, start + query.limit),
      total: filtered.length,
    };
  }

  async create(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }

  async update(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
