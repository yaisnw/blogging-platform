// Entry point for running the backend as a standalone server (Docker).
// api/index.ts exports the Express app without calling listen() because Vercel
// serverless handles that itself. Here we call listen() explicitly.

import app from './api/index.js';
import { connectDB } from './sequelize/connection.js';

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
