import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAnAuthenticateUser } from '@/utils/test/create-an-authenticate-user'

describe('Profile (2e2)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {

    const { token } = await createAnAuthenticateUser(app)

    const profileRes = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileRes.statusCode).toEqual(200)
    expect(profileRes.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com'
      })
    )
  })
})
