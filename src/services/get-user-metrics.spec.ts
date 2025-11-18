import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import type { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GetUserMetricsService } from "./get-user-metrics"

let checkInsRepo: CheckInsRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {

  beforeEach(async () => {
    checkInsRepo = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepo)
  })

  it('should be able to get the user check-ins count', async () => {

    await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepo.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })
    expect(checkInsCount).toEqual(2);
  })

})
