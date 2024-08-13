import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { DateTimeScalar } from "../../common/date/date";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , PrimaryColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@InputType()
@ObjectType()
@Entity({ name: "members", comment: "사용자"})
export class UserInput {

  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  @Field(() => Int, {nullable: true, description: '사용자 아이디'})
  readonly id: number;

  @Column()
  @Field(() => Number, { description: '등급, 권한'})
  grade: number;

  @Column()
  @Field(() => String, { description: '사용자 아이디'})
  user_id: String;

  @Column()
  @Field(type => String, { description: '사용자 비밀번호'})
  pass: string;

  @Column()
  @Field(() => String, { description: '사용자 이름'})
  user_name: String;

  @Column()
  @Field(type => String, { description: '이메일'})
  email: string;

  @Column()
  @Field(() => Number, { description: '부서'})
  department: number;

  @Column()
  @Field(() => String, { description: '읽기 권한'})
  read_grade: String;
  
  @Column()
  @Field(() => String, { description: '쓰기 권한'})
  write_grade: String;

  @Column()
  @Field(() => Number)
  only_jpg: number;

  @Column()
  @Field(() => Number)
  login_fail_count?: number;
  
  @Column({ type: 'timestamp' })
  @Field(() => Date)
  login_fail_time?: DateTimeScalar;
  
  //TypeORM Special Columns
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: DateTimeScalar;

//   @UpdateDateColumn()
//   @Field(() => Date)
//   updatedAt: Date;

}
