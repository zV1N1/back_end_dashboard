import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
  async store(req: Request, res: Response) {
    try {
      const {
        firstName, lastName, userName, email, password,
      } = req.body;

      const usersRepository = getCustomRepository(UserRepository);

      const emailAlreadyExists = await usersRepository.findOne({
        email,
      });

      const userNameAlreadyExists = await usersRepository.findOne({
        userName,
      });

      if (emailAlreadyExists || userNameAlreadyExists) {
        return res.status(409).send('userName or email already exists');
      }

      const user = usersRepository.create({
        firstName,
        lastName,
        userName,
        email,
        password_hash: password,
      });

      await usersRepository.save(user);

      return res.status(201).send({
        name: user.firstName,
        username: user.userName,
        email: user.email,
      });
    } catch (e) {
      return res.status(404).send({ error: 'Invalid data' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        email,
      } = req.body;

      const usersRepository = getCustomRepository(UserRepository);

      const userExists = await usersRepository.findOne({ where: { id: req.userId } });

      if (!userExists) {
        return res.status(401).send({ error: 'invalid User' });
      }

      const emailAlreadyExists = await usersRepository.findOne({
        email,
      });

      if (emailAlreadyExists) {
        return res.status(409).send('email already exists');
      }

      const user = await usersRepository.updateById(req.userId, {
        firstName,
        lastName,
        email,
      });

      return res.status(201).send({
        name: user?.firstName,
        userName: user?.userName,
        email: user?.email,
      });
    } catch (e) {
      return res.status(404).send({ error: 'Invalid data' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const usersRepository = getCustomRepository(UserRepository);

      const userExists = await usersRepository.findOne({ where: { id: req.userId } });

      if (!userExists) {
        return res.status(401).send({ error: 'invalid User' });
      }

      await usersRepository.delete(req.userId);

      return res.status(200).send({ message: 'user deleted successfully' });
    } catch (e) {
      return res.status(404).send({ error: 'error deleting user' });
    }
  }
}

export default new UserController();
