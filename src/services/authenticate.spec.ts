import { expect, it, describe } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { AuthenticateService } from "./authenticate"
import { InvalidCredentialsExistsError } from "./errors/invalid-credentials-error"
import { hash } from "bcryptjs"

describe('Authenticate Service', () => {
  it('should be able to authenticate', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepo)

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
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepo)

    await expect(async () => {
      await sut.execute({
        email: 'johndoe1@example.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsExistsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepo)

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
