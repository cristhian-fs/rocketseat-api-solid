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
    const { user } = await authenticateService.execute({
      email,
      password
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id
        }
      }
    )

    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsExistsError) {
      return reply.status(400)
    }
    return reply.status(500).send()
  }

}
