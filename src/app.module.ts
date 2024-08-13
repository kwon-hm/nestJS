import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user';
import { UserModule } from './user/user.module';
import { DateTimeScalar, DateScalar } from "./common/date/date";
import { DepartmentModule } from './department/department.module';
import { Department } from './department/entities/department';
import { LoggerModule } from "./common/logger/logger.module";

@Module({
    imports: [
        // graphql
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),

        // db
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'test',
            synchronize: false,
            logging: true,
            entities: [
                User,
                Department,
            ],
        }),
        LoggerModule,
        UserModule,
        DepartmentModule
    ],
    controllers: [],
    providers: [DateTimeScalar, DateScalar],
})
export class AppModule {}