import { GetUserProfileService } from "../get-user-profile";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUserRepository();
  const useCase = new GetUserProfileService(usersRepository)
  return useCase
}
