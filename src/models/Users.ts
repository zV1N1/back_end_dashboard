import {
  Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import bcryptjs from 'bcryptjs';

@Entity('users')
class User {
    @PrimaryColumn()
    readonly id: string

    @Column()
    name: string

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
}

export { User };
