import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class Authentication {
  async store(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;

      const usersRepository = getCustomRepository(UserRepository);

      const userExists = await usersRepository.findOne({ where: { userName } });

      if (!userExists) {
        return res.status(401).send({
          error: 'User not exists',
        });
      }

      const isValidPassword = await userExists.checkPassword(password);

      if (!isValidPassword) {
        return res.status(401).send({
          error: 'Invalid password',
        });
      }
      const { id } = userExists;
      const token = userExists.generateToken();

      return res.status(200).send(
        {
          token,
          user: {
            id, name: userExists.firstName, email: userExists.email, userName: userExists.userName,
          },
        },
      );
    } catch (e) {
      return res.status(404).send({
        error: 'Invalid email or password',
      });
    }
  }
}

export default new Authentication();
