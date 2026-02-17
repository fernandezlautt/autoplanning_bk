# AutoPlanning Backend

Express.js backend API for the AutoPlanning application.

## Features

- RESTful API for managing subjects, weeks, and resources
- PostgreSQL database with Sequelize ORM
- Excel export functionality
- TypeScript for type safety
- Modular architecture with separation of concerns

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autoplanning
DB_USER=postgres
DB_PASSWORD=postgres

# Semester configuration - Use dates instead of week numbers
# Format: YYYY-MM-DD or MM-DD (uses current year if year omitted)
# Examples: "2024-03-01" or "03-01" (March 1st)
SEMESTER_1_START_DATE=03-01
SEMESTER_1_END_DATE=06-30
SEMESTER_2_START_DATE=08-01
SEMESTER_2_END_DATE=12-31
YEARLY_START_DATE=03-01
YEARLY_END_DATE=12-31
```

3. Create the PostgreSQL database:
```sql
CREATE DATABASE autoplanning;
```

4. Run the application:
```bash
npm run dev
```

The server will start on `http://localhost:3001` and automatically create the database tables.

## API Endpoints

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create a new subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject

### Weeks
- `GET /api/weeks/:id` - Get week by ID
- `PUT /api/weeks/:id` - Update week content
- `POST /api/weeks/:weekId/resources` - Add resource to week
- `PUT /api/weeks/resources/:id` - Update resource
- `DELETE /api/weeks/resources/:id` - Delete resource

### Export
- `GET /api/export/subjects/:subjectId` - Export subject to Excel

## Project Structure

```
src/
├── config/          # Configuration files (database, semester)
├── models/          # Sequelize models
├── modules/         # Feature modules
│   ├── subjects/    # Subject module
│   │   ├── controller.ts
│   │   ├── model.ts (uses shared models)
│   │   ├── router.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── weeks/       # Week module
│   └── export/      # Export module
└── index.ts         # Application entry point
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
