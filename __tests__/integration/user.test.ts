import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../src/app';

import createConnection from '../../src/database';
import { UserRepository } from '../../src/repositories/UserRepository';

const createSut = () => getCustomRepository(UserRepository);

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
      firstName: 'vanessa',
      lastName: 'lekom',
      userName: 'Reaper21',
      email: 'vanessa@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user with exists email', async () => {
    const response = await request(app).post('/users').send({
      firstName: 'vanessa',
      lastName: 'lekom',
      userName: 'Reaper2',
      email: 'vanessa@example.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
  });

  it('Should not be able to create a new user with exists userName', async () => {
    const response = await request(app).post('/users').send({
      firstName: 'Vanny',
      lastName: 'Jelony',
      userName: 'Reaper21',
      email: 'vannyJL@example.com',
      password: '123456',
    });

    expect(response.status).toBe(409);
  });

  it('should be able to update user information', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Katy',
      lastName: 'Marry',
      userName: 'KeloUp',
      email: 'Keia@example.com',
      password_hash: '12323',
    });

    await sut.save(user);

    const response = await request(app).put('/users').send({
      firstName: 'Katy',
      lastName: 'Marry',
      email: 'Keiaa@example.com',
    }).set('Authorization', `Bearer ${user.generateToken()}`);

    const { email } = response.body;

    expect(email).toBe('Keiaa@example.com');
  });

  it('should be not able to update user with exists email', async () => {
    const sut = createSut();

    const user1 = sut.create({
      firstName: 'James',
      lastName: 'laira',
      userName: 'JameKK',
      email: 'jjmaru@example.com',
      password_hash: '12323',
    });

    const user2 = sut.create({
      firstName: 'mary',
      lastName: 'gonzales',
      userName: 'gloDow',
      email: 'MakeLops@example.com',
      password_hash: '12323',
    });

    await sut.save(user1);
    await sut.save(user2);

    const response = await request(app).put('/users').send({
      firstName: 'James',
      lastName: 'laira',
      email: 'MakeLops@example.com',
    }).set('Authorization', `Bearer ${user1.generateToken()}`);

    expect(response.status).toBe(409);
  });

  it('should be able to delete a user', async () => {
    const sut = createSut();

    const user = sut.create({
      firstName: 'Daniel',
      lastName: 'makes',
      userName: 'Dani02',
      email: 'DaniLyon@example.com',
      password_hash: '123223',
    });

    await sut.save(user);

    const response = await request(app).delete('/users').set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});
