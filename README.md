# TypeScript Interview API

A production-oriented REST API built with **TypeScript + Fastify** to demonstrate the engineering practices I use in real-world backend projects.

## What this project demonstrates

- Strict TypeScript configuration
- Clean Architecture / separation of concerns
- REST API design
- Runtime validation with Zod
- Dependency inversion through repository interfaces
- Centralized error handling
- Unit and API tests with Vitest
- ESLint + Prettier
- Environment-based configuration
- Docker support
- GitHub Actions CI
- Pagination, filtering and HTTP status semantics
- Small, testable modules

## Architecture

```text
src/
├── application/
│   └── services/
│       └── task.service.ts
├── domain/
│   ├── entities/
│   │   └── task.ts
│   └── repositories/
│       └── task.repository.ts
├── infrastructure/
│   └── repositories/
│       └── in-memory-task.repository.ts
├── interfaces/
│   └── http/
│       ├── routes/
│       │   └── task.routes.ts
│       └── server.ts
├── shared/
│   ├── errors/
│   │   └── app-error.ts
│   └── config.ts
└── app.ts
```

The dependency direction is intentional:

`HTTP → Application → Domain ← Infrastructure`

The domain does not depend on Fastify, Zod, or a database implementation.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/tasks` | List tasks with pagination/filtering |
| GET | `/api/v1/tasks/:id` | Get a task |
| POST | `/api/v1/tasks` | Create a task |
| PATCH | `/api/v1/tasks/:id` | Update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

### Example

```bash
curl -X POST http://localhost:3000/api/v1/tasks   -H "content-type: application/json"   -d '{"title":"Prepare TypeScript interview","priority":"high"}'
```

## Run locally

Requirements: Node.js 20+

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm start
```

Tests:

```bash
npm test
npm run test:coverage
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run format:check
```

## Interview talking points

### Why TypeScript strict mode?
It catches invalid assumptions at compile time and makes public interfaces explicit.

### Why repository interfaces?
The application layer depends on an abstraction instead of a storage technology. The in-memory implementation can later be replaced by PostgreSQL, MongoDB or another adapter without changing the business logic.

### Why Zod?
TypeScript types disappear at runtime. API input comes from outside the type system, so runtime validation is still required.

### Why tests at two levels?
Unit tests verify business behavior quickly. HTTP tests verify that routing, validation and error handling work together.

## Possible next iterations

- PostgreSQL + Prisma adapter
- Authentication / RBAC
- Redis caching
- OpenAPI / Swagger
- Structured logging
- Rate limiting
- Docker Compose
- Integration tests against PostgreSQL
- Observability with OpenTelemetry

## License

MIT
