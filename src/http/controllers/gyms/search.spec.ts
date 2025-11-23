import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAnAuthenticateUser } from '@/utils/test/create-an-authenticate-user'

describe('Search Gyms (2e2)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {

    const { token } = await createAnAuthenticateUser(app, true)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: null,
        phone: null,
        latitude: -18.1993472,
        longitude: -45.2225602,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: null,
        phone: null,
        latitude: -18.1993472,
        longitude: -45.2225602,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Javascript'
      })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym'
      })
    ])
  })
})
