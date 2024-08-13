import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

@InputType()
@ObjectType()
@Entity({ name: "departments", comment: "부서"})
export class CreateDepartmentInput {
    @Column()
    @Field(() => String, {nullable: false, description: '부서 이름'})
    readonly name: string;
}