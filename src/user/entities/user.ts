import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , PrimaryColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { MinLength, MaxLength, IsEmail } from "class-validator";
import { DateTimeScalar } from "../../common/date/date";
import { Department } from "../../department/entities/department";

// @InputType()
@ObjectType()
@Entity({ name: "members", comment: "사용자"})
export class User {

  @PrimaryGeneratedColumn()
  @Field(() => Int, {nullable: false, description: '사용자 아이디'})
  readonly id: number;

  @Column()
  @Field(() => Int, {nullable: false, description: '등급, 권한'})
  readonly grade: number;

  @Column()
  @Field(type => String, {nullable: false, description: '사용자 아이디'})
  readonly user_id: String;

  @Column()
  @Field(type => String, {nullable: false, description: '사용자 비밀번호'})
  @MinLength(4)
  readonly pass: string;

  @Column()
  @Field(() => String, {nullable: false, description: '사용자 이름'})
  readonly user_name: String;

  @Column()
  @Field(type => String, {nullable: false, description: '이메일'})
  @IsEmail()
  readonly email: string;

  @OneToOne(() => Department)
  @JoinColumn({ name: 'department' })
  @Field(() => Department, {nullable: true, description: '부서'})
  department?: Department;

  @Column()
  @Field(() => String, {nullable: true, description: '읽기 권한'})
  readonly read_grade: String;
  
  @Column()
  @Field(() => String, {nullable: true, description: '쓰기 권한'})
  readonly write_grade: String;

  @Column()
  @Field(() => Int, {nullable: false, })
  readonly only_jpg: number;

  @Column()
  @Field(() => Int, {nullable: false, })
  readonly login_fail_count?: number;
  
  @Column({ type: 'timestamp' })
  @Field(() => Date, {nullable: true, })
  readonly login_fail_time?: DateTimeScalar;

   
  
  //TypeORM Special Columns
//   @CreateDateColumn()
//   @Field(() => Date)
//   createdAt: Date;

//   @UpdateDateColumn()
//   @Field(() => Date)
//   updatedAt: Date;

}
