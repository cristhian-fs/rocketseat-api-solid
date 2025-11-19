import { expect, it, describe, beforeEach } from "vitest"
import type { CheckInsRepository } from "@/repositories/check-ins-repository"
import { SearchGymsService } from "./search-gyms"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

let gymsRepo: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search gyms Service', () => {

  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepo)
  })

  it('should be able to fetch gyms by query', async () => {

    await gymsRepo.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -18.1993472,
      longitude: -45.2225602,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })
    expect(gyms).toHaveLength(1);
  })

  it('should be able to fetch paginated gyms', async () => {

    for (let index = 1; index <= 22; index++) {
      await gymsRepo.create({
        title: `Javascript Gym ${index}`,
        description: null,
        phone: null,
        latitude: -18.1993472,
        longitude: -45.2225602,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2
    })
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ])
  })
})
