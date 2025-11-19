import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInService } from "../validate-check-in";

export function makeValidateCheckInService() {
  const checkInsRepo = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInService(checkInsRepo)
  return useCase
}
