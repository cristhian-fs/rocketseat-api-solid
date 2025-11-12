import type { FastifyInstance } from "fastify";
import { registerUser } from "./controllers/register";
import { authenticateUser } from "./controllers/authenticate";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)
}
