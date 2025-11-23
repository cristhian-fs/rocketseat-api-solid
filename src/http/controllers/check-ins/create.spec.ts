import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAnAuthenticateUser } from '@/utils/test/create-an-authenticate-user'
import { prisma } from "@/lib/prisma"

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAnAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -18.1993472,
        longitude: -45.2225602,
      }
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -18.1993472,
        longitude: -45.2225602,
      })

    expect(response.statusCode).toEqual(201)
  })
})
