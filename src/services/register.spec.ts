import { expect, test, it, describe } from "vitest"
import { RegisterService } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepo)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password'
    })


    expect(user.id).toEqual(expect.any(String));
  })
  it('should hash user password upon registration', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepo)

    const { user } = await registerService.execute({
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
    const usersRepo = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepo)

    const email = 'johndoe@example.com'
    await registerService.execute({
      name: 'John Doe',
      email,
      password: 'password'
    })

    expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: 'password'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)

  })
})
