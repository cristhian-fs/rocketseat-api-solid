import type { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateService } from "@/services/authenticate"
import { InvalidCredentialsExistsError } from "@/services/errors/invalid-credentials-error"
import { makeAuthenticateService } from "@/services/factories/make-authenticate-use-case"

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()
    await authenticateService.execute({
      email,
      password
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsExistsError) {
      return reply.status(400)
    }
    return reply.status(500).send()
  }

  return reply.status(201).send()
}
