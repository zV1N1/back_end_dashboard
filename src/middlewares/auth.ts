import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

interface TokenPayload {
    id: string
    userName: string
    iat: number
    exp: number
}

export default function authMiddleware(
  req: Request, res: Response, next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.SECRET_TOKEN as string);
    const { id, userName } = data as TokenPayload;

    const userRepository = getCustomRepository(UserRepository);

    const userExists = userRepository.findOne({ where: { userName } });

    if (!userExists) {
      return res.status(401).send('User invalid');
    }
    req.userId = id;
    req.userName = userName;
    return next();
  } catch (e) {
    return res.status(401).json({
      error: 'Expired or invalid token.',
    });
  }
}
