import type { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { RegisterService } from "@/services/register"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error"
import { makeRegisterUseCase } from "@/services/factories/make-register-use-case"

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterUseCase()
    await registerService.execute({
      name,
      email,
      password
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send()
    }
    return reply.status(500).send()
  }

  return reply.status(201).send()
}
