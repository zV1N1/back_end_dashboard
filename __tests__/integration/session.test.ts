import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../src/app';

import createConnection from '../../src/database';

import { UserRepository } from '../../src/repositories/UserRepository';

const createSut = () => getCustomRepository(UserRepository);

describe('Authentication', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });
  it('should authenticate with valid credentials', async () => {
    const sut = createSut();

    const user = sut.create({
      name: 'Robert',
      email: 'robert@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      email: user.email,
      password: '123456',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid email', async () => {
    const sut = createSut();

    const user = sut.create({
      name: 'Robert',
      email: 'robert123@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      email: 'roberrt1@example.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
  });

  it('should not authenticate with invalid password', async () => {
    const sut = createSut();

    const user = sut.create({
      name: 'Vanessa',
      email: 'vanessa@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      email: user.email,
      password: '23456',
    });

    expect(response.status).toBe(401);
  });

  it('Should return jwt token when authenticated', async () => {
    const sut = createSut();

    const user = sut.create({
      name: 'Jackson',
      email: 'jackon@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      email: user.email,
      password: '12323',
    });

    expect(response.body).toHaveProperty('token');
  });
});
