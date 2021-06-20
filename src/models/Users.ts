import {
  Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Entity('users')
class User {
    @PrimaryColumn()
    readonly id: string

    @Column()
    userName: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password_hash: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    constructor() {
      if (!this.id) {
        this.id = uuid();
      }
    }

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
      this.password_hash = bcryptjs.hashSync(this.password_hash, 8);
    }

    checkPassword(password: string): Promise<boolean> {
      return bcryptjs.compare(password, this.password_hash);
    }

    generateToken() {
      const token = jwt.sign({ id: this.id, userName: this.userName }, process.env.SECRET_TOKEN as string, { expiresIn: '1d' });
      return token;
    }
}

export { User };
