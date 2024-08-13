import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './entities/user';
import { DepartmentModule } from '../department/department.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        DepartmentModule,
        LoggerModule
    ],
    providers: [
        UserResolver, 
        UserService,
    ],
})
export class UserModule {}
