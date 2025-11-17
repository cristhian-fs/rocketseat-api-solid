import { expect, it, describe, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { CheckInService } from "./check-in"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime/library"

let usersRepo: InMemoryCheckInsRepository
let gymsRepo: InMemoryGymsRepository
let sut: CheckInService

const GYM_COORDINATES = {
  latitude: -18.1993472,
  longitude: -45.2225602,
}
const USER_COORDINATES = {
  latitude: -18.1993472,
  longitude: -45.2225602,
}

describe('Check In Service', () => {
  beforeEach(() => {
    usersRepo = new InMemoryCheckInsRepository();
    gymsRepo = new InMemoryGymsRepository();
    sut = new CheckInService(usersRepo, gymsRepo)

    gymsRepo.items.push({
      id: 'gym-01',
      title: 'Fake Gym',
      description: 'gym desc',
      phone: '',
      latitude: new Decimal(GYM_COORDINATES.latitude),
      longitude: new Decimal(GYM_COORDINATES.longitude)
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: USER_COORDINATES.latitude,
      userLongitude: USER_COORDINATES.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String));
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: USER_COORDINATES.latitude,
      userLongitude: USER_COORDINATES.longitude,
    })


    await expect(async () => {
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: USER_COORDINATES.latitude,
        userLongitude: USER_COORDINATES.longitude,
      })
    }).rejects.toBeInstanceOf(Error)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: USER_COORDINATES.latitude,
      userLongitude: USER_COORDINATES.longitude,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: USER_COORDINATES.latitude,
      userLongitude: USER_COORDINATES.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkIn if user is 100 meters away from gym', async () => {
    gymsRepo.items.push({
      id: 'gym-02',
      title: 'Fake Gym 2',
      description: 'gym desc',
      phone: '',
      latitude: new Decimal(-18.2000000),
      longitude: new Decimal(-45.2300000)
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: USER_COORDINATES.latitude,
        userLongitude: USER_COORDINATES.longitude,
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
