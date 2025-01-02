import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { genSalt, hashSync } from 'bcrypt';
import { Credentials } from './entities/credentials.entity';

interface IUserService {
  findUserByEmail(email: string): Promise<User>;

  findUserByUsername(username: string): Promise<User>;

  existedEmail(email: string): Promise<boolean>;

  findUserByIdOrFail(id: number): Promise<User>;

  createNewUser(
    email: string,
    name: string,
    password?: string
  ): Promise<number>;
}

@Injectable()
export class UserService implements IUserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>

  public findUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({
      email,
    });
  }

  public findUserByUsername(username: string): Promise<User> {
    return this.userRepo.findOneBy({
      username,
    });
  }

  public existedEmail(email: string): Promise<boolean> {
    return this.userRepo.existsBy({ email });
  }

  public findUserByIdOrFail(id: number): Promise<User> {
    return this.userRepo.findOneByOrFail({id});
  }

  public async createNewUser(
    email: string,
    name: string,
    password?: string
  ): Promise<number> {
    const user = this.userRepo.create();
    user.email = email;

    if (password) {
      const salt = await genSalt(10);
      user.salt = salt;
      user.password = hashSync(password, salt);
    }

    user.confirmed = false;
    user.name = name;

    user.credentials = new Credentials();
    user.credentials.version = 0;
    user.credentials.passwordUpdatedAt = new Date();

    await user.save();
    return user.id;
  }
}
