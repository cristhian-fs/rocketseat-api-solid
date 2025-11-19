import { expect, it, describe, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { ValidateCheckInService } from "./validate-check-in"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { LateCheckInValidationTimeError } from "./errors/late-check-in-validation-time-error"

let checkInsRepo: InMemoryCheckInsRepository
let sut: ValidateCheckInService


describe('Check In Service', () => {
  beforeEach(async () => {
    checkInsRepo = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepo)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {

    const createdCheckIn = await checkInsRepo.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepo.items[0]?.validated_at).toEqual(expect.any(Date));
  })
  it('should not be able to validate an inexistent check-in', async () => {

    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {

    vi.setSystemTime(new Date(2025, 10, 18, 13, 40, 0));

    const createdCheckIn = await checkInsRepo.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const TIME_TO_ADVANCE_IN_MS = 1000 * 60 * 21; // 21 minutes
    vi.advanceTimersByTime(TIME_TO_ADVANCE_IN_MS)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationTimeError)
  })
})
