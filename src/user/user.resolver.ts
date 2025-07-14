import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user', nullable: true })
  async getUser(@Args('id') id: string): Promise<User | null> {
    return await this.userService.findUserById(id);
  }

  @Mutation(() => User, { name: 'createTestUser' })
  async createTestUser(): Promise<User> {
    return await this.userService.createTestUser();
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(
    @Args('email') email: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<User> {
    return await this.userService.createUser(email, firstName, lastName);
  }
}
