import Fastify from 'fastify';
import { ZodError } from 'zod';
import { TaskService } from '../../application/services/task.service.js';
import { InMemoryTaskRepository } from '../../infrastructure/repositories/in-memory-task.repository.js';
import { AppError } from '../../shared/errors/app-error.js';
import { taskRoutes } from './routes/task.routes.js';

export function buildServer() {
  const app = Fastify({ logger: true });
  const repository = new InMemoryTaskRepository();
  const service = new TaskService(repository);

  app.get('/health', async () => ({
    status: 'ok',
    service: 'typescript-interview-api',
    timestamp: new Date().toISOString(),
  }));

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.issues,
      });
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
      });
    }

    app.log.error(error);
    return reply.code(500).send({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  });

  void taskRoutes(app, service);

  return app;
}
