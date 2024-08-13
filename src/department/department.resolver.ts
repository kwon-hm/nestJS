import { Args, Context, Field, Int, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Department } from './entities/department';
import { DepartmentService } from './department.service';
import { CreateDepartmentInput } from './dto/departmentInput';
import { LoggerService } from '../common/logger/logger.service';

@ObjectType()
class DepartmentWithCount {
  @Field(() => [Department])
  departments: Department[];

  @Field(type => Int)
  count: number;
}

@Resolver(of => Department)
export class DepartmentResolver {
    constructor(
        private readonly logger: LoggerService,
        private readonly departmentService: DepartmentService
    ) {} 

    /**
     * Get all departments.
     * @param limit: number
     * @param offset: number
     * @returns {departments: Department[], count: number}
     */
    @Query(returns => DepartmentWithCount)
    getDepartments(
        @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Args('name', { type: () => String, nullable: true}) name: string,
        @Context() context: any,
    ): Promise<DepartmentWithCount> {
        try {
            this.logger.log(`getDepartments - name: ${name} offset: ${offset} limit: ${limit}`, context)

            return this.departmentService.getDepartmentsExe(
                offset, 
                limit,
                name,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * Get department by id.
     * @param id 
     * @returns Department
     */
    @Query(returns => Department, {nullable: true})
    getDepartmentByid(
        @Args('id') id: number,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`getDepartmentByid - id: ${id}`, context)

            return this.departmentService.getDepartmentByidExe(
                id,
                context,
            )
        } catch (err) {
            throw err            
        }
    }

    /**
     * create department.
     * @param Department
     * @returns Department
     */
    @Mutation(returns => Department)
    createDepartment(
        @Args('createUserInput') createDepartmentInput: CreateDepartmentInput,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`createDepartment - createDepartmentInput: ${JSON.stringify(createDepartmentInput)}`, context)

            return this.departmentService.createDepartmentExe(
                createDepartmentInput,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * update department.
     * @param Department
     * @returns Department
     */
    @Mutation(returns => Department)
    updateDepartment(
        @Args('id', { type: () => Int }) id: number,
        @Args('createDepartmentInput') createDepartmentInput: CreateDepartmentInput,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`updateDepartment - id: ${id} createDepartmentInput: ${JSON.stringify(createDepartmentInput)}`, context)

            return this.departmentService.updateDepartmentExe(
                id,
                createDepartmentInput,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * delete department.
     * @param id
     * @returns Department
     */
    @Mutation(returns => Boolean)
    deleteDepartment(
        @Args('id', { type: () => Int }) id: number,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`deleteDepartment - id: ${id}`, context)

            return this.departmentService.deleteDepartmentExe(
                id,
                context,
            )
        } catch (err) {
            throw err
        }
    }

}
