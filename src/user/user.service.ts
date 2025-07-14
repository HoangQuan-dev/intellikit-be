import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      firstName,
      lastName,
    });
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createTestUser(): Promise<User> {
    const testEmail = 'test@example.com';
    const existingUser = await this.findUserByEmail(testEmail);

    if (existingUser) {
      return existingUser;
    }

    return await this.createUser(testEmail, 'Test', 'User');
  }
}
