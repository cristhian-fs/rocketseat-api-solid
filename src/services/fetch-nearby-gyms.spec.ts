import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { FetchNearbyGymsService } from "./fetch-nearby-gyms"

let gymsRepo: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Search Nearby Gyms Service', () => {

  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepo)
  })

  it('should be able to fetch nearby gyms by userLatitude and userLongitude', async () => {

    await gymsRepo.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -18.1993472,
      longitude: -45.2225602,
    })

    await gymsRepo.create({
      title: 'Away gym',
      description: null,
      phone: null,
      latitude: -17.9889127,
      longitude: -45.6169286,
    })
    const { gyms } = await sut.execute({
      userLatitude: -18.1993472,
      userLongitude: -45.2225602
    })
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ])
  })

})
