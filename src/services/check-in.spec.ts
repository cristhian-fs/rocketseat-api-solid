import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { CheckInService } from "./check-in"

let usersRepo: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check In Service', () => {
  beforeEach(() => {
    usersRepo = new InMemoryCheckInsRepository();
    sut = new CheckInService(usersRepo)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })

    expect(checkIn.id).toEqual(expect.any(String));
  })
})
