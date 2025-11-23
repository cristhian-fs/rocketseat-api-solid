import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {

  const validateCheckInParam = z.object({
    checkInId: z.uuid()
  })

  const { checkInId } = validateCheckInParam.parse(request.params);
  const validateCheckInService = makeValidateCheckInService();

  await validateCheckInService.execute({
    checkInId,
  })

  return reply.status(204).send()
}
