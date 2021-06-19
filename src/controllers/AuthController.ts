import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import bcript from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

class Authentication {
  async store(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const usersRepository = getCustomRepository(UserRepository);

      const userExists = await usersRepository.findOne({ where: { email } });

      if (!userExists) {
        return res.status(401).send({
          error: ['User not exists'],
        });
      }

      const isValidPassword = await bcript.compare(password, userExists.password_hash);

      if (!isValidPassword) {
        return res.status(401).send({
          error: ['Invalid password'],
        });
      }
      const { id } = userExists;
      const token = jwt.sign({ id, email }, process.env.SECRET_TOKEN as string, { expiresIn: '1d' });

      return res.status(200).send(
        {
          token,
          user: { id, name: userExists.name, email: userExists.email },
        },
      );
    } catch (e) {
      return res.status(404).send({
        error: ['unknown error'],
      });
    }
  }
}

export default new Authentication();
