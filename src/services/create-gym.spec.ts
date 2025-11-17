import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { CreateGymService } from "./create-gym"

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -18.1993472,
      longitude: -45.2225602,
    })


    expect(gym.id).toEqual(expect.any(String));
  })
})
