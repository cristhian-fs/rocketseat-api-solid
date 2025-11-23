import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/gyms', create)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
}
