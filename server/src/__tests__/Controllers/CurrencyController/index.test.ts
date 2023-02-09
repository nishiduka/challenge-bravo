import { dataRedis } from 'mocks/Redis'
import request from 'supertest'

import { Server } from 'Utils/Server'
jest.mock('axios')

describe('Currency Controller', () => {
  let app = null as any

  beforeAll(async () => {
    app = await new Server().init()
  })

  describe('Server Testes', () => {
    it('Should return route not found', async () => {
      await request(app).get('/api/teste').expect(404)
    })
  })
  describe('Retrive quotation', () => {
    it('Should return validation error', async () => {
      await request(app).get('/api/currency/convert').expect(400)
    })

    it('Should return an error Coin not found', async () => {
      await request(app)
        .get('/api/currency/convert?from=GSP&to=USD&amount=1')
        .expect(400)
    })

    it('Should return a valid quotation from BRL to USD', async () => {
      await request(app)
        .get('/api/currency/convert?from=BRL&to=USD&amount=1')
        .expect(200)
    })

    it('Should return a valid quotation  from USD to BRL', async () => {
      await request(app)
        .get('/api/currency/convert?from=USD&to=BRL&amount=1')
        .expect(200)
    })
  })

  describe('Create quotation', () => {
    it('Should return validation error', async () => {
      await request(app).post('/api/currency/new').expect(400)
    })

    it('Should create a new quotation', async () => {
      await request(app)
        .post('/api/currency/new')
        .send({
          from: 'CSG',
          value: 10
        })
        .expect(201)

      expect(dataRedis['CSG']).toBe(
        `{\"name\":\"CSG\",\"value\":10,\"requiredBySystem\":false}`
      )
    })

    it('Should return error coin already created', async () => {
      await request(app)
        .post('/api/currency/new')
        .send({
          from: 'CSG',
          value: 10
        })
        .expect(400)
    })
  })

  describe('Update quotation', () => {
    it('Should return validation error', async () => {
      await request(app).patch('/api/currency/update/UPT').expect(400)
    })

    it('Should return error coin not exist', async () => {
      await request(app)
        .patch('/api/currency/update/UPT')
        .send({
          value: 110
        })
        .expect(400)
    })

    it('Should update a quotation', async () => {
      await request(app)
        .patch('/api/currency/update/CSG')
        .send({
          value: 110
        })
        .expect(201)

      expect(dataRedis['CSG']).toBe(
        `{\"name\":\"CSG\",\"value\":110,\"requiredBySystem\":false}`
      )
    })
  })

  describe('Remove quotation', () => {
    it('Should remove a quotation created', async () => {
      await request(app).delete('/api/currency/CSG').expect(202)

      expect(dataRedis['CSG']).toBe(undefined)
    })

    it('Should return error coin not exist', async () => {
      await request(app).delete('/api/currency/CSG').expect(400)
    })

    it('Should return error coin cannot be deleted', async () => {
      await request(app).delete('/api/currency/BRL').expect(400)
    })
  })
})