import { Args, Context, Field, Int, Mutation, ObjectType, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from "./entities/user";
import { UserService } from './user.service';
import { UserInput } from "./dto/userInput";
import { DepartmentService } from '../department/department.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ObjectType()
class UsersWithCount {
    @Field(() => [User])
    users: User[];

    @Field(type => Int)
    count: number;
}

@Resolver(of => User)
// @ApiTags('users')
export class UserResolver {
    
    constructor(
        private readonly logger: LoggerService,
        private readonly userService: UserService,
        private readonly departmentService: DepartmentService,
    ) {}    

    /**
     * Get all users.
     * @param limit: number
     * @param offset: number
     * @returns {users: User[], count: number}
     */
    @Query(returns => UsersWithCount)
    // @ApiOperation({summary: '유저 조회', description: '유저 조회 페이징'})
    // @ApiCreatedResponse({description: 'user test'})
    getUsers(
        @Args('user_id', { type: () => String, nullable: true}) user_id: string,
        @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Context() context: any,
    ): Promise<UsersWithCount> {
        try {
            this.logger.log(`getUsers - user_id: ${user_id} offset: ${offset} limit: ${limit}`, context)

            return this.userService.getUserExe(
                offset, 
                limit,
                user_id,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * Get user by id.
     * @param id 
     * @returns User
     */
    @Query(returns => User, {nullable: true})
    getUserByid(
        @Args('id') id: number,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`getUserByid - id: ${id}`, context)

            return this.userService.getUserByidExe(
                id,
                context,
            )
        } catch (err) {
            throw err            
        }
    }

    /**
     * create user.
     * @param User
     * @returns User
     */
    @Mutation(returns => User)
    createUser(
        @Args('userInput') userInput: UserInput,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`createUser - userInput: ${JSON.stringify(userInput)}`, context)

            return this.userService.createUserExe(
                userInput,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * update user.
     * @param User
     * @returns User
     */
    @Mutation(returns => User)
    updateUser(
        @Args('id', { type: () => Int }) id: number,
        @Args('userInput') userInput: UserInput,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`updateUser - userInput: ${JSON.stringify(userInput)}`, context)

            return this.userService.updateUserExe(
                id,
                userInput,
                context,
            )
        } catch (err) {
            throw err
        }
    }

    /**
     * delete user.
     * @param id
     * @returns User
     */
    @Mutation(returns => Boolean)
    deleteUser(
        @Args('id', { type: () => Int }) id: number,
        @Context() context: any,
    ) {
        try {
            this.logger.log(`updateUser - id: ${id}`, context)

            return this.userService.deleteUserExe(
                id, 
                context,
            )
        } catch (err) {
            throw err
        }
    }

}