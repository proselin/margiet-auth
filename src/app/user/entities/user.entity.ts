import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Credentials } from './credentials.entity';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { BCRYPT_HASH_OR_UNSET, SLUG_REGEX } from '../../common/constant/regex';
import { IUser } from '../types';

@Entity('user')
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsString()
  @Length(3, 100)
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slugs',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  @IsString()
  @Length(5, 60)
  @Matches(BCRYPT_HASH_OR_UNSET)
  password: string | null;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  salt: string;

  @Column({ type: 'boolean', default: 0 })
  confirmed: boolean;

  @Column(() => Credentials)
  credentials: Credentials;

}
