import type { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { makeCheckInService } from "@/services/factories/make-check-in-service"

export async function create(request: FastifyRequest, reply: FastifyReply) {

  const createCheckInParamSchema = z.object({
    gymId: z.uuid()
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })

  const { gymId } = createCheckInParamSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.query)

  const createGymService = makeCheckInService()
  await createGymService.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub
  })

  return reply.status(201).send()
}
