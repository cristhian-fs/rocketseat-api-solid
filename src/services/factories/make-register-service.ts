import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterService } from "../register"

export function makeRegisterUseCase() {
  const prismaRepository = new PrismaUserRepository()
  const registerService = new RegisterService(prismaRepository)
  return registerService
}
