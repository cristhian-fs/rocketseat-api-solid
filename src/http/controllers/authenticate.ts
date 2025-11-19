import type { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { InvalidCredentialsExistsError } from "@/services/errors/invalid-credentials-error"
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service"

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
