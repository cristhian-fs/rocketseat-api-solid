import type { FastifyInstance } from "fastify";
import { registerUser } from "./register";
import { authenticateUser } from "./authenticate";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { profile } from "./profile";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticateUser)

  app.get('/me', { onRequest: [verifyJWT] }, profile);
  app.patch('/token/refresh', refresh)
}
