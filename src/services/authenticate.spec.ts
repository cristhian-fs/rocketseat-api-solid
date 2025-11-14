import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { AuthenticateService } from "./authenticate"
import { InvalidCredentialsExistsError } from "./errors/invalid-credentials-error"
import { hash } from "bcryptjs"
import type { UsersRepository } from "@/repositories/users-repository"

let usersRepo: UsersRepository;
let sut: AuthenticateService;

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepo)
  })
  it('should be able to authenticate', async () => {
    await usersRepo.create({
      name: 'Johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('password', 6)
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password'
    })

    expect(user.id).toEqual(expect.any(String));
  })
  it('should not be able to authenticate with wrong email', async () => {
    await expect(async () => {
      await sut.execute({
        email: 'johndoe1@example.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsExistsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepo.create({
      name: 'Johndoe',
      email: 'johndoe@example.com',
      password_hash: 'password'
    })
    await expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123123'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsExistsError)
  })
})
