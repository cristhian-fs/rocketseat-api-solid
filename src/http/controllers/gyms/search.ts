import type { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { makeSearchGymsService } from "@/services/factories/make-search-gyms"

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.query)

  const searchGymService = makeSearchGymsService()
  const { gyms } = await searchGymService.execute({
    query: q, page
  })

  return reply.status(200).send({
    gyms
  })
}
