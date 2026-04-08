# School Management API

## Project Overview

A simple backend API built with Node.js, Express, and TypeScript to manage schools and list them by proximity using latitude/longitude.

## Folder Structure

```text
educase-india/
├── src/
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   ├── utils/
│   └── server.ts
├── School_Management_API.postman_collection.json
├── .env.example
├── package.json
└── tsconfig.json
```

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL (Neon)
- Zod
- pg

## Routes List

- `GET /`
- `POST /api/schools/add`
- `GET /api/schools/list?latitude=<lat>&longitude=<lng>`
- `GET /api/schools/:id`
- `PUT /api/schools/:id`
- `DELETE /api/schools/:id`
