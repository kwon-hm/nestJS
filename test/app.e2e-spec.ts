import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(done => {
        app.close()
        done()
    })

    describe('users', () => {
        it('should query getUsers and return users', () => {
            const query = `
            query {
                getUsers(offset: 0, limit: 10) {
                users {
                    id
                    user_id
                }
                count
                }
            }
            `;
            return request(app.getHttpServer())
                .post('/graphql')
                .send({ query })
                .expect(200)
                .expect((res) => {
                    console.log("getUsers 결과", JSON.stringify(res.body.data.getUsers))
                    expect(res.body.data.getUsers.users.length).toEqual(10)
                });
        });

        it('should query getUserByid and return a user', () => {
            const user = {
                "id": 20,
                "user_name": "테스트",
                "grade": 0,
                "user_id": "test2",
                "pass": "1234",
                "email": "a",
                "department": null,
                "read_grade": "read_grade",
                "write_grade": "write_grade",
                "only_jpg": 0,
                "login_fail_count": 0,
                "login_fail_time": null
            }
            const query = `
            query {
                getUserByid(id: 20 ){
                    id
                    user_name
                    grade
                    user_id
                    pass
                    email
                    department{
                        id
                    }
                    read_grade
                    write_grade
                    only_jpg
                    login_fail_count
                    login_fail_time
                }
            }
            `
            return request(app.getHttpServer())
                .post('/graphql')
                .send({ query })
                .expect(200)
                .expect((res) => {
                    console.log("getUserByid 결과", JSON.stringify(res.body.data.getUserByid))
                    expect(res.body.data.getUserByid).toEqual(user)
                });
        })

        it('should create a user using createUser mutation', () => {


            const user = {
                "id": 25,
                "user_name": "테스트",
                "grade": 0,
                "user_id": "test21",
                "pass": "1234",
                "email": "a",
                "department": {
                    "id": 1,
                    "name": "콘텐츠운영사업본부"
                },
                "read_grade": "read_grade",
                "write_grade": "write_grade",
                "only_jpg": 0,
                "login_fail_count": 0,
                "login_fail_time": null
            }
            const query = `
            mutation{
                createUser(
                    userInput:{
                    user_id: "test21"
                    grade: 0
                    pass: "1234"
                    user_name: "테스트"
                    email: "a"
                    department: 1
                    read_grade: "read_grade"
                    write_grade: "write_grade"
                    only_jpg: 0
                    login_fail_count: 0
                    login_fail_time: "2024"
                    createdAt: "2023"
                    }
                ){
                    id
                    user_name
                    grade
                    user_id
                    pass
                    email
                    department{
                    id
                    name
                    }
                    read_grade
                    write_grade
                    only_jpg
                    login_fail_count
                    login_fail_time
                }
            }
            `
            return request(app.getHttpServer())
                .post('/graphql')
                .send({ query })
                .expect(200)
                .expect((res) => {
                    console.log("createUser 결과", JSON.stringify(res.body.data.createUser))
                    expect(res.body.data.createUser).toEqual(user)
            });
        })
    })


});
