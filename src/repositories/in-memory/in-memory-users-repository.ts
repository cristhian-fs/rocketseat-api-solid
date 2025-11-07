import type { User } from "@/generated/client";
import type { UsersRepository } from "../users-repository";
import type { UserCreateInput } from "@/generated/models";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
  async create(data: UserCreateInput): Promise<User> {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      created_at: new Date(),
      password_hash: data.password_hash
    }
    this.items.push(user);

    return user
  }
}
