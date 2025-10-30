import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user';
import { UserModule } from './user/user.module';
import { DateTimeScalar, DateScalar } from './common/date/date';
import { DepartmentModule } from './department/department.module';
import { Department } from './department/entities/department';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', '1234'),
        database: configService.get<string>('DB_DATABASE', 'ylab_preview'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', true),
        entities: [User, Department],
      }),
      inject: [ConfigService],
    }),

    LoggerModule,
    UserModule,
    DepartmentModule,
  ],
  controllers: [],
  providers: [DateTimeScalar, DateScalar],
})
export class AppModule {}
