import type { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsExistsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import type { CheckIn } from "@/generated/client";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
}

interface CheckInServiceResponse {
  checkIn: CheckIn
};

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute(
    { userId, gymId }: CheckInServiceRequest,
  ): Promise<CheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId
    });

    return {
      checkIn
    }

  }
}
