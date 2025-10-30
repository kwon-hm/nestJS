import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository, Like } from 'typeorm';
import { UserInput } from './dto/userInput';
import { Department } from '../department/entities/department';
import { LoggerService } from '../common/logger/logger.service';
import { RequestContext } from '../common/types/context.type';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * Get all users with pagination and optional filtering.
   * @param offset - Pagination offset
   * @param limit - Pagination limit
   * @param userId - Optional user_id filter
   * @param context - Request context for logging
   * @returns Object containing users array and total count
   */
  async getUsers(
    offset: number,
    limit: number,
    userId: string,
    context: RequestContext,
  ): Promise<{ users: User[]; count: number }> {
    try {
      const where = userId ? { user_id: Like(`%${userId}%`) } : {};

      const [users, count] = await this.userRepository.findAndCount({
        relations: ['department'],
        where,
        skip: offset,
        take: limit,
      });

      this.logger.log(`Retrieved ${count} users`, context);
      return { users, count };
    } catch (error) {
      this.logger.error(
        `Failed to get users: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Get user by ID.
   * @param id - User ID
   * @param context - Request context for logging
   * @returns User entity or null
   */
  async getUserById(id: number, context: RequestContext): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['department'],
      });

      if (user) {
        this.logger.log(`Retrieved user with id: ${id}`, context);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to get user by id ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  /**
   * Create a new user.
   * @param userInput - User input data
   * @param context - Request context for logging
   * @returns Created user entity
   */
  async createUser(
    userInput: UserInput,
    context: RequestContext,
  ): Promise<User> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id: userInput.department },
      });

      if (!department) {
        throw new NotFoundException(
          `Department with id ${userInput.department} not found`,
        );
      }

      const newUser = this.userRepository.create({
        ...userInput,
        department,
      });

      const result = await this.userRepository.save(newUser);

      this.logger.log(`Created user with id: ${result.id}`, context);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to create user: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Update an existing user.
   * @param id - User ID to update
   * @param userInput - Updated user data
   * @param context - Request context for logging
   * @returns Updated user entity
   */
  async updateUser(
    id: number,
    userInput: UserInput,
    context: RequestContext,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const department = await this.departmentRepository.findOne({
        where: { id: userInput.department },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with id ${userInput.department} not found`,
        );
      }

      Object.assign(user, userInput, { department });
      const result = await this.userRepository.save(user);

      this.logger.log(`Updated user with id: ${id}`, context);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update user ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete a user.
   * @param id - User ID to delete
   * @param context - Request context for logging
   * @returns True if deletion was successful
   */
  async deleteUser(id: number, context: RequestContext): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await this.userRepository.remove(user);

      this.logger.log(`Deleted user with id: ${id}`, context);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete user ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
