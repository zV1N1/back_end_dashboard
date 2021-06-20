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
      firstName: 'Robert',
      lastName: 'Gare',
      userName: 'robt',
      email: 'robert@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      userName: user.userName,
      password: '123456',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid userName', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Robert',
      lastName: 'Loura',
      userName: 'ron2',
      email: 'robert123@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      userName: 'ro21',
      password: '123456',
    });

    expect(response.status).toBe(401);
  });

  it('should not authenticate with invalid password', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Vanessa',
      lastName: 'Lax',
      userName: 'ReaperX',
      email: 'vanessa@example.com',
      password_hash: '123456',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      userName: user.userName,
      password: '23456',
    });

    expect(response.status).toBe(401);
  });

  it('Should return jwt token when authenticated', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Jackson',
      lastName: 'kai',
      userName: 'JK',
      email: 'jackon@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app).post('/auth').send({
      userName: user.userName,
      password: '12323',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Katy',
      lastName: 'Marry',
      userName: 'KeloUp',
      email: 'Keia@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app)
      .put('/users').send({
        firstName: 'Katy',
        lastName: 'Marry',
        userName: 'KeloUp',
        email: 'Keiaa@example.com',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(201);
  });

  it('should not be able to access private routes without jwt token', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Katy',
      lastName: 'Marry',
      userName: 'KelosUp',
      email: 'Keia@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app)
      .put('/users').send({
        firstName: 'Katy',
        lastName: 'Marry',
        userName: 'KeloUp',
        email: 'Keiaa@example.com',
      });
    const { error } = response.body;

    expect(error).toBe('No token provided');
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Lorry',
      lastName: 'stark',
      userName: 'keuLo',
      email: 'Larry12@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app)
      .put('/users').send({
        firstName: 'Lorry',
        lastName: 'stark',
        userName: 'keuLo',
        email: 'Larry122@example.com',
      })
      .set('Authorization', 'Bearer 12321');

    const { error } = response.body;

    expect(error).toBe('Expired or invalid token.');
  });
});
