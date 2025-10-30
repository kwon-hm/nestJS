import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Department } from '../../department/entities/department';

@ObjectType()
@Entity({ name: 'members', comment: '사용자' })
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: false, description: '사용자 아이디' })
  readonly id: number;

  @Column()
  @Field(() => Int, { nullable: false, description: '등급, 권한' })
  readonly grade: number;

  @Column()
  @Field(() => String, { nullable: false, description: '사용자 아이디' })
  readonly user_id: string;

  @Column()
  @Field(() => String, { nullable: false, description: '사용자 비밀번호' })
  readonly pass: string;

  @Column()
  @Field(() => String, { nullable: false, description: '사용자 이름' })
  readonly user_name: string;

  @Column()
  @Field(() => String, { nullable: false, description: '이메일' })
  readonly email: string;

  @OneToOne(() => Department)
  @JoinColumn({ name: 'department' })
  @Field(() => Department, { nullable: true, description: '부서' })
  department?: Department;

  @Column()
  @Field(() => String, { nullable: true, description: '읽기 권한' })
  readonly read_grade: string;

  @Column()
  @Field(() => String, { nullable: true, description: '쓰기 권한' })
  readonly write_grade: string;

  @Column()
  @Field(() => Int, { nullable: false, description: 'JPG만 허용 여부' })
  readonly only_jpg: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: '로그인 실패 횟수' })
  readonly login_fail_count?: number;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true, description: '로그인 실패 시간' })
  readonly login_fail_time?: Date;
}
