import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../../src/app';

import createConnection from '../../src/database';

describe('Creating a new user', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'vanessa',
      email: 'vanessa@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user with exists email', async () => {
    const response = await request(app).post('/users').send({
      name: 'vanessa',
      email: 'vanessa@example.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
  });
});
