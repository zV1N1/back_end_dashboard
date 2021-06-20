import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/Users';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  updateById(id: string, data: object) {
    this.update(id, data);

    return this.findOne({ where: { id } });
  }
}

export { UserRepository };
