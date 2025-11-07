# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

uCATPCHA is a monorepo-based CAPTCHA verification system with a focus on Verifiable Delay Functions (VDFs). The system consists of multiple packages that work together to provide a comprehensive CAPTCHA solution.

## Architecture

This is a Bun workspace monorepo with the following packages:

- **packages/backend** - Hono-based API server handling CAPTCHA challenges and verification
- **packages/frontend** - Next.js dashboard for managing sites and viewing statistics
- **packages/shared** - Shared database utilities and models (Drizzle ORM)
- **packages/js** - JavaScript client library for solving CAPTCHAs
- **packages/core** - Core utilities and types
- **packages/wasm** - Rust-based WebAssembly VDF solver

The backend uses PostgreSQL for persistent storage and Redis for caching/rate limiting. The system implements VDF-based challenges that require computational work to solve.

## Development Commands

### Root Level
```bash
bun install                    # Install all dependencies
bun run format                 # Format code with Prettier
```

### Backend (packages/backend)
```bash
cd packages/backend
bun run dev                    # Start development server with hot reload
bun run start                  # Start production server
```

### Frontend (packages/frontend)
```bash
cd packages/frontend
bun run dev                    # Start Next.js dev server (port 7922)
bun run build                  # Build for production
bun run start                  # Start production server
```

### Shared/Database (packages/shared)
```bash
cd packages/shared
bun run push                   # Push database schema changes
bun run studio                 # Open Drizzle Studio
```

### Docker Development
```bash
docker-compose up -d           # Start all services (postgres, redis, backend, frontend)
docker-compose down            # Stop all services
docker-compose logs -f backend # Follow backend logs
docker-compose logs -f frontend # Follow frontend logs
```

## Key Technologies

- **Backend**: Hono, Bun, Drizzle ORM, PostgreSQL, Redis, Zod validation
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI, Jotai state management
- **Client Library**: Comlink for web workers, WASM integration
- **WASM Solver**: Rust with wasm-bindgen for VDF computation
- **Database**: PostgreSQL with Drizzle ORM
- **Infrastructure**: Docker Compose for local development

## API Endpoints

The backend provides these main endpoints:
- `GET /challenge/new` - Generate new CAPTCHA challenge
- `GET /challenge/:id` - Get existing challenge details
- `POST /challenge/:id/check` - Verify challenge solution
- `POST /challenge/:id/answer` - Submit solution
- `/sites/*` - Site management endpoints
- `/resources/*` - Resource endpoints

## Database

Uses Drizzle ORM with PostgreSQL. Schema files and migrations are in the packages/shared directory. Both backend and frontend share the same database models through the shared package.

## Environment Variables

Key environment variables for development:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis server host
- `PORT` - Server port (backend: 8732, frontend: 7922)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` - Initial admin user setup

## Testing & Building

The project uses Bun as the primary runtime and package manager. The frontend builds to standalone mode for Docker deployment. The WASM package needs to be built before the JS package can use it.