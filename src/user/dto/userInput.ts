import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UserInput {
  @ApiProperty({ description: '등급, 권한' })
  @Field(() => Int, { description: '등급, 권한' })
  @IsNumber()
  grade: number;

  @ApiProperty({ description: '사용자 아이디' })
  @Field(() => String, { description: '사용자 아이디' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @Field(() => String, { description: '사용자 비밀번호' })
  @IsString()
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다' })
  pass: string;

  @ApiProperty({ description: '사용자 이름' })
  @Field(() => String, { description: '사용자 이름' })
  @IsString()
  user_name: string;

  @ApiProperty({ description: '이메일' })
  @Field(() => String, { description: '이메일' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email: string;

  @ApiProperty({ description: '부서' })
  @Field(() => Int, { description: '부서' })
  @IsNumber()
  department: number;

  @ApiProperty({ description: '읽기 권한' })
  @Field(() => String, { description: '읽기 권한' })
  @IsString()
  read_grade: string;

  @ApiProperty({ description: '쓰기 권한' })
  @Field(() => String, { description: '쓰기 권한' })
  @IsString()
  write_grade: string;

  @ApiProperty({ description: 'JPG만 허용 여부' })
  @Field(() => Int, { description: 'JPG만 허용 여부' })
  @IsNumber()
  only_jpg: number;

  @ApiProperty({ description: '로그인 실패 횟수', required: false })
  @Field(() => Int, { nullable: true, description: '로그인 실패 횟수' })
  @IsOptional()
  @IsNumber()
  login_fail_count?: number;

  @ApiProperty({ description: '로그인 실패 시간', required: false })
  @Field(() => Date, { nullable: true, description: '로그인 실패 시간' })
  @IsOptional()
  login_fail_time?: Date;
}
