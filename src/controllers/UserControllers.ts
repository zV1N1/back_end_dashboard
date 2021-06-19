import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const usersRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return res.status(409).send('User already exists');
    }
    const user = usersRepository.create({
      name,
      email,
      password_hash: password,
    });

    await usersRepository.save(user);

    user.password_hash = '';
    return res.status(201).send(user);
  }
}

export default new UserController();
