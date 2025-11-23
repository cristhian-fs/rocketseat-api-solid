import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

  const historyCheckInsService = makeGetUserMetricsService()

  const { checkInsCount } = await historyCheckInsService.execute({
    userId: request.user.sub
  })

  return reply.status(200).send({
    checkInsCount
  })
}
