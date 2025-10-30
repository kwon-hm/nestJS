import {
  Args,
  Context,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user';
import { UserService } from './user.service';
import { UserInput } from './dto/userInput';
import { LoggerService } from '../common/logger/logger.service';
import { RequestContext } from '../common/types/context.type';

@ObjectType()
class UsersWithCount {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  count: number;
}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get all users with pagination and optional filtering.
   * @param userId - Optional user_id filter
   * @param offset - Pagination offset
   * @param limit - Pagination limit
   * @param context - Request context
   * @returns Object containing users array and total count
   */
  @Query(() => UsersWithCount, {
    description: '사용자 목록 조회 (페이징 및 필터링)',
  })
  async getUsers(
    @Args('user_id', { type: () => String, nullable: true }) userId: string,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Context() context: RequestContext,
  ): Promise<UsersWithCount> {
    this.logger.log(
      `getUsers - user_id: ${userId}, offset: ${offset}, limit: ${limit}`,
      context,
    );
    return this.userService.getUsers(offset, limit, userId, context);
  }

  /**
   * Get user by ID.
   * @param id - User ID
   * @param context - Request context
   * @returns User entity or null
   */
  @Query(() => User, { nullable: true, description: 'ID로 사용자 조회' })
  async getUserById(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: RequestContext,
  ): Promise<User | null> {
    this.logger.log(`getUserById - id: ${id}`, context);
    return this.userService.getUserById(id, context);
  }

  /**
   * Create a new user.
   * @param userInput - User input data
   * @param context - Request context
   * @returns Created user entity
   */
  @Mutation(() => User, { description: '새 사용자 생성' })
  async createUser(
    @Args('userInput') userInput: UserInput,
    @Context() context: RequestContext,
  ): Promise<User> {
    this.logger.log(
      `createUser - userInput: ${JSON.stringify(userInput)}`,
      context,
    );
    return this.userService.createUser(userInput, context);
  }

  /**
   * Update an existing user.
   * @param id - User ID to update
   * @param userInput - Updated user data
   * @param context - Request context
   * @returns Updated user entity
   */
  @Mutation(() => User, { description: '사용자 정보 수정' })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('userInput') userInput: UserInput,
    @Context() context: RequestContext,
  ): Promise<User> {
    this.logger.log(
      `updateUser - id: ${id}, userInput: ${JSON.stringify(userInput)}`,
      context,
    );
    return this.userService.updateUser(id, userInput, context);
  }

  /**
   * Delete a user.
   * @param id - User ID to delete
   * @param context - Request context
   * @returns True if deletion was successful
   */
  @Mutation(() => Boolean, { description: '사용자 삭제' })
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: RequestContext,
  ): Promise<boolean> {
    this.logger.log(`deleteUser - id: ${id}`, context);
    return this.userService.deleteUser(id, context);
  }
}
