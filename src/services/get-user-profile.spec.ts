import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { hash } from "bcryptjs"
import type { UsersRepository } from "@/repositories/users-repository"
import { GetUserProfileService } from "./get-user-profile"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

let usersRepo: UsersRepository;
let sut: GetUserProfileService;

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepo)
  })
  it('should be able to get user by user id', async () => {
    const createdUser = await usersRepo.create({
      name: 'Johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('password', 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(expect.any(String));
  })
  it('should not be able to get the user with the wrong id', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'non-existing-user'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
