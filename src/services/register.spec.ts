import { expect, it, describe, beforeEach } from "vitest"
import { RegisterService } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

let usersRepo: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepo)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password'
    })


    expect(user.id).toEqual(expect.any(String));
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password'
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true);
  })
  it('should not be able to register with the same email twice', async () => {
    const email = 'johndoe@example.com'
    await sut.execute({
      name: 'John Doe',
      email,
      password: 'password'
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: 'password'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
