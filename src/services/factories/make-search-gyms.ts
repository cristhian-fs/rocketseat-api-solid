import { SearchGymsService } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeSearchGymsService() {
  const gymsRepo = new PrismaGymsRepository();
  const useCase = new SearchGymsService(gymsRepo)
  return useCase
}
