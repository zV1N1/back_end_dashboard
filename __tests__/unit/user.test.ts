import { getConnection, getCustomRepository } from 'typeorm';
import bcrypt from 'bcryptjs';

import createConnection from '../../src/database';
import { UserRepository } from '../../src/repositories/UserRepository';

const createSut = () => getCustomRepository(UserRepository);

describe('User', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should encrypt user password', async () => {
    const sut = createSut();

    const user = sut.create({
      name: 'Robert',
      email: 'robert@example.com',
      password_hash: '123456',
    });
    await sut.save(user);

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
