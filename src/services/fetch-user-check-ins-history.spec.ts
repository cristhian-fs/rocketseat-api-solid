import { expect, it, describe, beforeEach } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { FetchUserCheckInsHistoryService } from "./fetch-user-check-ins-history"
import type { CheckInsRepository } from "@/repositories/check-ins-repository"

let checkInsRepo: CheckInsRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch User Check-ins History Service', () => {

  beforeEach(async () => {
    checkInsRepo = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepo)
  })

  it('should be able to fetch user check-ins history', async () => {

    await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepo.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1
    })
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {

    for (let index = 1; index <= 22; index++) {
      await checkInsRepo.create({
        gym_id: `gym-${index}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2
    })
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
