import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from './entities/department';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepartmentInput } from './dto/departmentInput';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class DepartmentService {
    constructor(
        private readonly logger: LoggerService,

        @InjectRepository(Department) 
        private departmentRepository: Repository<Department>,
    ) {}

    /**
     * Get all departments.
     * @param limit: number
     * @param offset: number
     * @returns {departments: Department[], count: number}
     */
    async getDepartmentsExe(
        offset: number,
        limit: number,
        name: string,
        context: any,
    ): Promise<{ departments: Department[]; count: number; }> {
        try {
            let where = {}
            if(name) where = {name: Like(`%${name}%`)}
            const [departments, count] = await this.departmentRepository.findAndCount({
                where,
                skip: offset,
                take: limit,
            })

            this.logger.log(`getDepartmentsExe - count: ${count}`, context)
            return {departments, count}
        } catch (err) {
            this.logger.error(`getDepartmentsExe ${err}`, context)
            throw new Error(`getDepartmentsExe ${err}`)
        }
    }

    /**
     * Get department by id.
     * @param id 
     * @returns Department
     */
    async getDepartmentByidExe(
        id: number,
        context: any,
    ) {
        try {
            const department = await this.departmentRepository.findOne({where: {id}})

            this.logger.log(`getDepartmentByidExe - department: ${department}`, context)
            return department
        } catch (err) {
            this.logger.error(`getDepartmentByidExe ${err}`, context)
            throw new Error(`getDepartmentByidExe ${err}`)
        }
    }

    /**
     * create department.
     * @param Department
     * @returns Department
     */
    createDepartmentExe(
        createDepartmentData: CreateDepartmentInput,
        context: any,
    ) {
        try {
            const newDepartment = this.departmentRepository.create(createDepartmentData)
            const result = this.departmentRepository.save(newDepartment)

            this.logger.log(`createDepartmentExe - result: ${JSON.stringify(result)}`, context)
            return result
        } catch (err) {
            this.logger.error(`createDepartmentExe ${err}`, context)
            throw new Error(`createDepartmentExe ${err}`)
        }
    }

    /**
     * update department.
     * @param Department
     * @returns Department
     */
    async updateDepartmentExe(
        id: number,
        createDepartmentData: CreateDepartmentInput,
        context: any,
    ) {
        try {
            const department = await this.departmentRepository.findOne({where: {id}});
            if (!department) throw new NotFoundException('Department not found');

            Object.assign(department, createDepartmentData); // Update department entity with new data
            const result = this.departmentRepository.save(department); // Save updated department to the database

            this.logger.log(`updateDepartmentExe - result: ${JSON.stringify(result)}`, context)
            return result
        } catch (err) {
            this.logger.error(`updateDepartmentExe ${err}`, context)
            throw new Error(`updateDepartmentExe ${err}`)
        }
    }

    /**
     * delete department.
     * @param id
     * @returns Department
     */
    async deleteDepartmentExe(
        id: number,
        context: any,
    ) {
        try {
            const department = await this.departmentRepository.findOne({where: {id}});
            if (!department) throw new NotFoundException('Department not found');

            const result = await this.departmentRepository.remove(department);

            this.logger.log(`deleteDepartmentExe - result: ${JSON.stringify(result)}`, context)
            return !!result
        } catch (err) {
            this.logger.error(`deleteDepartmentExe ${err}`, context)
            throw new Error(`deleteDepartmentExe err: ${err}`)
        }
    }
}
