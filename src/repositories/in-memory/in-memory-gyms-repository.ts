import type { Gym, User } from "@/generated/client";
import type { UsersRepository } from "../users-repository";
import type { UserCreateInput } from "@/generated/models";
import type { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []
  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) return null;

    return gym
  }
}
