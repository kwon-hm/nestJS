import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateDepartmentInput {
  @ApiProperty({ description: '부서 이름' })
  @Field(() => String, { nullable: false, description: '부서 이름' })
  @IsString({ message: '부서 이름은 문자열이어야 합니다' })
  readonly name: string;
}
