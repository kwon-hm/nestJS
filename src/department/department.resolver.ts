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
import { Department } from './entities/department';
import { DepartmentService } from './department.service';
import { CreateDepartmentInput } from './dto/departmentInput';
import { LoggerService } from '../common/logger/logger.service';
import { RequestContext } from '../common/types/context.type';

@ObjectType()
class DepartmentWithCount {
  @Field(() => [Department])
  departments: Department[];

  @Field(() => Int)
  count: number;
}

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(
    private readonly logger: LoggerService,
    private readonly departmentService: DepartmentService,
  ) {}

  /**
   * Get all departments with pagination and optional filtering.
   * @param offset - Pagination offset
   * @param limit - Pagination limit
   * @param name - Optional name filter
   * @param context - Request context
   * @returns Object containing departments array and total count
   */
  @Query(() => DepartmentWithCount, {
    description: '부서 목록 조회 (페이징 및 필터링)',
  })
  async getDepartments(
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('name', { type: () => String, nullable: true }) name: string,
    @Context() context: RequestContext,
  ): Promise<DepartmentWithCount> {
    this.logger.log(
      `getDepartments - name: ${name}, offset: ${offset}, limit: ${limit}`,
      context,
    );
    return this.departmentService.getDepartments(offset, limit, name, context);
  }

  /**
   * Get department by ID.
   * @param id - Department ID
   * @param context - Request context
   * @returns Department entity or null
   */
  @Query(() => Department, { nullable: true, description: 'ID로 부서 조회' })
  async getDepartmentById(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: RequestContext,
  ): Promise<Department | null> {
    this.logger.log(`getDepartmentById - id: ${id}`, context);
    return this.departmentService.getDepartmentById(id, context);
  }

  /**
   * Create a new department.
   * @param departmentInput - Department input data
   * @param context - Request context
   * @returns Created department entity
   */
  @Mutation(() => Department, { description: '새 부서 생성' })
  async createDepartment(
    @Args('createDepartmentInput') departmentInput: CreateDepartmentInput,
    @Context() context: RequestContext,
  ): Promise<Department> {
    this.logger.log(
      `createDepartment - departmentInput: ${JSON.stringify(departmentInput)}`,
      context,
    );
    return this.departmentService.createDepartment(departmentInput, context);
  }

  /**
   * Update an existing department.
   * @param id - Department ID to update
   * @param departmentInput - Updated department data
   * @param context - Request context
   * @returns Updated department entity
   */
  @Mutation(() => Department, { description: '부서 정보 수정' })
  async updateDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('createDepartmentInput') departmentInput: CreateDepartmentInput,
    @Context() context: RequestContext,
  ): Promise<Department> {
    this.logger.log(
      `updateDepartment - id: ${id}, departmentInput: ${JSON.stringify(departmentInput)}`,
      context,
    );
    return this.departmentService.updateDepartment(
      id,
      departmentInput,
      context,
    );
  }

  /**
   * Delete a department.
   * @param id - Department ID to delete
   * @param context - Request context
   * @returns True if deletion was successful
   */
  @Mutation(() => Boolean, { description: '부서 삭제' })
  async deleteDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: RequestContext,
  ): Promise<boolean> {
    this.logger.log(`deleteDepartment - id: ${id}`, context);
    return this.departmentService.deleteDepartment(id, context);
  }
}
