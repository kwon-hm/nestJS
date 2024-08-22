import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from './entities/user';
import { Repository, Like } from "typeorm";
import { UserInput } from './dto/userInput';
import { Department } from '../department/entities/department';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class UserService {
    
    constructor(
        private readonly logger: LoggerService,

        @InjectRepository(User) 
        private userRepository: Repository<User>,

        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
    ) {}

    /**
     * Get all users.
     * @param limit: number
     * @param offset: number
     * @param user_id: user_id
     * @returns {users: User[], count: number}
     */
    async getUserExe(
        offset: number,
        limit: number,
        user_id: string,
        context: any,
    ): Promise<{ users: User[]; count: number; }> {
        try {
            
            let where = null
            if(user_id) where = {user_id: Like(`%${user_id}%`)}
            const [users, count] = await this.userRepository.findAndCount({
                relations: ['department'],
                where,
                skip: offset,
                take: limit,
            })

            this.logger.log(`getUserExe - count: ${count}`, context)
            return {users, count}
        } catch (err) {
            this.logger.error(`getUserExe ${err}`, context)
            throw new Error(`getUserExe ${err}`)
        }
    }

    /**
     * Get user by id.
     * @param id 
     * @returns User
     */
    async getUserByidExe(
        id: number,
        context: any,
    ) {
        try {
            const user = await this.userRepository.findOne({
                where: {id},
                relations: ['department'],
            })

            this.logger.log(`getUserByidExe - user: ${JSON.stringify(user)}`, context)
            return user
        } catch (err) {
            this.logger.error(`getUserByidExe ${err}`, context)
            throw new Error(`getUserByidExe ${err}`)
        }
    }

    /**
     * create user.
     * @param User
     * @returns User
     */
    async createUserExe(
        userDataInput: UserInput,
        context: any,
    ) {
        try {
            const department = await this.departmentRepository.findOne({ where: { id: userDataInput.department } });

            if (!department) {
                throw new Error('Department not found');
            }

            const newUser = this.userRepository.create({
                ...userDataInput,
                department,
            })
            const result = await this.userRepository.save(newUser)
            
            this.logger.log(`createUserExe - newUser: ${JSON.stringify(result)}`, context)
            return result
        } catch (err) {
            this.logger.error(`createUserExe ${err}`, context)
            throw new Error(`createUserExe ${err}`)
        }
    }

    /**
     * update user.
     * @param id
     * @param User
     * @returns User
     */
    async updateUserExe(
        id: number,
        userDataInput: UserInput,
        context: any,
    ) {
        try {
            const user = await this.userRepository.findOne({where: {id}});
            if (!user) throw new NotFoundException('User not found');

            const department = await this.departmentRepository.findOne({ where: { id: userDataInput.department } });
            if (!department) throw new NotFoundException('Department not found');

            Object.assign(user, userDataInput); // Update user entity with new data
            let result = await this.userRepository.save(user); // Save updated user to the database
            if(result) result.department = department

            this.logger.log(`updateUserExe - res: ${JSON.stringify(result)}`, context)

            return result
        } catch (err) {
            this.logger.error(`updateUserExe ${err}`, context)
            throw new Error(`updateUserExe ${err}`)
        }
    }

    /**
     * delete user.
     * @param id
     * @returns User
     */
    async deleteUserExe(
        id: number,
        context: any
    ) {
        try {
            const user = await this.userRepository.findOne({where: {id}});
            if (!user) throw new NotFoundException('User not found');

            const result = await this.userRepository.remove(user);

            this.logger.log(`deleteUserExe - res: ${JSON.stringify(result)}`, context)
            return !!result
        } catch (err) {
            this.logger.error(`deleteUserExe ${err}`, context)
            throw new Error(`deleteUserExe ${err}`)
        }
    }
}