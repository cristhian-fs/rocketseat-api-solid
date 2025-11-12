import type { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsExistsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import type { User } from "@/generated/client";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: User
};

export class AuthenticateService {
  constructor(
    private usersRepository: UsersRepository,
  ) { }

  async execute(
    { email, password }: AuthenticateServiceRequest,
  ): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsExistsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsExistsError()
    }
    return {
      user
    }
  }
}
