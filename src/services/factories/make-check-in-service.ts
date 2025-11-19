import { CheckInService } from "../check-in"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInService(checkInsRepository, gymsRepository)
  return useCase
}
