import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , PrimaryColumn } from "typeorm";

@ObjectType()
@Entity({ name: "departments", comment: "부서"})
export class Department {
    @PrimaryGeneratedColumn()
    @Field(() => Int, {nullable: false, description: '부서 아이디', })
    readonly id: number;
  
    @Column()
    @Field(() => String, {nullable: false, description: '부서 이름'})
    readonly name: string;
}