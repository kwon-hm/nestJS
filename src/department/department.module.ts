import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Department]), 
        LoggerModule,
    ],
    providers: [DepartmentResolver, DepartmentService],
    exports: [
        DepartmentService,
        TypeOrmModule
    ]
})
export class DepartmentModule {}
