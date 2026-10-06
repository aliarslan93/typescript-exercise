import { buildServer } from './app.js';
import { config } from './shared/config.js';

const app = buildServer();
//0.0.0.0
//localhost 127.0.0.1
try {
  await app.listen({ host: '127.0.0.1', port: config.PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
