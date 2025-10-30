import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Department } from './entities/department';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepartmentInput } from './dto/departmentInput';
import { LoggerService } from '../common/logger/logger.service';
import { RequestContext } from '../common/types/context.type';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * Get all departments with pagination and optional filtering.
   * @param offset - Pagination offset
   * @param limit - Pagination limit
   * @param name - Optional name filter
   * @param context - Request context for logging
   * @returns Object containing departments array and total count
   */
  async getDepartments(
    offset: number,
    limit: number,
    name: string,
    context: RequestContext,
  ): Promise<{ departments: Department[]; count: number }> {
    try {
      const where = name ? { name: Like(`%${name}%`) } : {};

      const [departments, count] = await this.departmentRepository.findAndCount(
        {
          where,
          skip: offset,
          take: limit,
        },
      );

      this.logger.log(`Retrieved ${count} departments`, context);
      return { departments, count };
    } catch (error) {
      this.logger.error(
        `Failed to get departments: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve departments');
    }
  }

  /**
   * Get department by ID.
   * @param id - Department ID
   * @param context - Request context for logging
   * @returns Department entity or null
   */
  async getDepartmentById(
    id: number,
    context: RequestContext,
  ): Promise<Department | null> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (department) {
        this.logger.log(`Retrieved department with id: ${id}`, context);
      }

      return department;
    } catch (error) {
      this.logger.error(
        `Failed to get department by id ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to retrieve department');
    }
  }

  /**
   * Create a new department.
   * @param departmentInput - Department input data
   * @param context - Request context for logging
   * @returns Created department entity
   */
  async createDepartment(
    departmentInput: CreateDepartmentInput,
    context: RequestContext,
  ): Promise<Department> {
    try {
      const newDepartment = this.departmentRepository.create(departmentInput);
      const result = await this.departmentRepository.save(newDepartment);

      this.logger.log(`Created department with id: ${result.id}`, context);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create department: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create department');
    }
  }

  /**
   * Update an existing department.
   * @param id - Department ID to update
   * @param departmentInput - Updated department data
   * @param context - Request context for logging
   * @returns Updated department entity
   */
  async updateDepartment(
    id: number,
    departmentInput: CreateDepartmentInput,
    context: RequestContext,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });
      if (!department) {
        throw new NotFoundException(`Department with id ${id} not found`);
      }

      Object.assign(department, departmentInput);
      const result = await this.departmentRepository.save(department);

      this.logger.log(`Updated department with id: ${id}`, context);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update department ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update department');
    }
  }

  /**
   * Delete a department.
   * @param id - Department ID to delete
   * @param context - Request context for logging
   * @returns True if deletion was successful
   */
  async deleteDepartment(
    id: number,
    context: RequestContext,
  ): Promise<boolean> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
      });
      if (!department) {
        throw new NotFoundException(`Department with id ${id} not found`);
      }

      await this.departmentRepository.remove(department);

      this.logger.log(`Deleted department with id: ${id}`, context);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete department ${id}: ${error.message}`,
        context,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete department');
    }
  }
}
