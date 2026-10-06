import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TASK_PRIORITIES } from '../../../domain/entities/task.js';
import { TaskService } from '../../../application/services/task.service.js';

const idSchema = z.object({ id: z.string().uuid() });

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  priority: z.enum(TASK_PRIORITIES).default('medium'),
});

const updateSchema = createSchema.partial().extend({
  completed: z.boolean().optional(),
});

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  completed: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

export async function taskRoutes(
  app: FastifyInstance,
  service: TaskService,
): Promise<void> {
  app.get('/api/v1/tasks', async (request) => {
    const query = listSchema.parse(request.query);
    return service.list(query);
  });

  app.get('/api/v1/tasks/:id', async (request) => {
    const { id } = idSchema.parse(request.params);
    return service.get(id);
  });

  app.post('/api/v1/tasks', async (request, reply) => {
    const input = createSchema.parse(request.body);
    const task = await service.create(input);
    return reply.code(201).send(task);
  });

  app.patch('/api/v1/tasks/:id', async (request) => {
    const { id } = idSchema.parse(request.params);
    const input = updateSchema.parse(request.body);
    return service.update(id, input);
  });

  app.delete('/api/v1/tasks/:id', async (request, reply) => {
    const { id } = idSchema.parse(request.params);
    await service.delete(id);
    return reply.code(204).send();
  });
}
