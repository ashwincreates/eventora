# Eventora

This is a simple event management system made using Next.js and FastAPI.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: the [Next.js](https://nextjs.org/) frontend application for the event management system
- `api`: a [FastAPI](https://fastapi.tiangolo.com/) app serving as the backend for the event management system
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting


### web
The web application is built using Next.js and provides a user-friendly interface for managing events.

#### Running the web application
set the api url in web/api/events, the default is `http://localhost:8000`
```
cd apps/web
npm run dev
```

The frontend will be accessible at http://localhost:3000.

### api
The API is built using FastAPI and provides a RESTful API for managing events.

#### Running the API
1. Create the venv
```
cd apps/api
python -m venv venv
source venv/bin/activate
```
2. Install the dependencies
```
pip install -r requirements.txt
```
3. Set the db url in api/.env
```
DB_URL=postgresql://ashwinsharma:root@localhost:5432/eventora
```
4. Run the API
```
fastapi run app
```

The API will be accessible at http://localhost:8000.

### DB Migration
DB Migrations are handled using SQLModel itself, which provides a simple and efficient way to manage database migrations.

#### Schema
```
Events Table
  - id: int
  - name: str
  - description: str
  - start_time: datetime
  - end_time: datetime
  - max_capacity: int

Attendees Table
  - id: int
  - name: str
  - email: str
  - event_id: int
```
