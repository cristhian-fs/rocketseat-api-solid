import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (2e2)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const response = await request(app.server)
      .post('/gyms')
      .send({
        title: 'Javascript Gym',
        description: null,
        phone: null,
        latitude: -18.1993472,
        longitude: -45.2225602,
      })

    expect(response.statusCode).toEqual(201)
  })
})
