import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAnAuthenticateUser } from '@/utils/test/create-an-authenticate-user'

describe('Nearby Gyms (2e2)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for nearby gyms', async () => {

    const { token } = await createAnAuthenticateUser(app)
    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -18.1993472,
      longitude: -45.2225602,
    })

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'Away gym',
      description: null,
      phone: null,
      latitude: -17.9889127,
      longitude: -45.6169286,
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -18.1993472,
        longitude: -45.2225602
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ])
  })
})
