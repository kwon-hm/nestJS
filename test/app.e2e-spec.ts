import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL API E2E Tests', () => {
  let app: INestApplication;
  let createdUserId: number;
  let createdDepartmentId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // ValidationPipe 적용 (실제 환경과 동일하게)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ==================== Department Tests ====================
  describe('Department API', () => {
    describe('createDepartment', () => {
      it('새 부서를 생성해야 합니다', () => {
        const query = `
          mutation {
            createDepartment(createDepartmentInput: { name: "테스트부서E2E" }) {
              id
              name
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createDepartment).toBeDefined();
            expect(res.body.data.createDepartment.name).toBe('테스트부서E2E');
            createdDepartmentId = res.body.data.createDepartment.id;
          });
      });
    });

    describe('getDepartments', () => {
      it('부서 목록을 조회해야 합니다', () => {
        const query = `
          query {
            getDepartments(offset: 0, limit: 10) {
              departments {
                id
                name
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
            expect(res.body.data.getDepartments).toBeDefined();
            expect(res.body.data.getDepartments.count).toBeGreaterThanOrEqual(
              1,
            );
            expect(
              Array.isArray(res.body.data.getDepartments.departments),
            ).toBe(true);
          });
      });

      it('이름으로 부서를 검색해야 합니다', () => {
        const query = `
          query {
            getDepartments(offset: 0, limit: 10, name: "테스트") {
              departments {
                id
                name
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
            expect(res.body.data.getDepartments).toBeDefined();
          });
      });
    });

    describe('getDepartmentById', () => {
      it('ID로 부서를 조회해야 합니다', () => {
        const query = `
          query {
            getDepartmentById(id: ${createdDepartmentId}) {
              id
              name
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getDepartmentById).toBeDefined();
            expect(res.body.data.getDepartmentById.id).toBe(
              createdDepartmentId,
            );
          });
      });
    });

    describe('updateDepartment', () => {
      it('부서 정보를 수정해야 합니다', () => {
        const query = `
          mutation {
            updateDepartment(
              id: ${createdDepartmentId}
              createDepartmentInput: { name: "수정된테스트부서" }
            ) {
              id
              name
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateDepartment).toBeDefined();
            expect(res.body.data.updateDepartment.name).toBe(
              '수정된테스트부서',
            );
          });
      });
    });
  });

  // ==================== User Tests ====================
  describe('User API', () => {
    describe('createUser', () => {
      it('새 사용자를 생성해야 합니다', () => {
        const query = `
          mutation {
            createUser(
              userInput: {
                grade: 1
                user_id: "e2e_test_user"
                pass: "test1234"
                user_name: "E2E 테스트 사용자"
                email: "e2etest@example.com"
                department: ${createdDepartmentId}
                read_grade: "all"
                write_grade: "all"
                only_jpg: 0
              }
            ) {
              id
              user_id
              user_name
              email
              department {
                id
                name
              }
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser).toBeDefined();
            expect(res.body.data.createUser.user_id).toBe('e2e_test_user');
            createdUserId = res.body.data.createUser.id;
          });
      });

      it('유효하지 않은 이메일로 사용자 생성 시 에러가 발생해야 합니다', () => {
        const query = `
          mutation {
            createUser(
              userInput: {
                grade: 1
                user_id: "invalid_email_user"
                pass: "test1234"
                user_name: "Invalid Email User"
                email: "invalid-email"
                department: ${createdDepartmentId}
                read_grade: "all"
                write_grade: "all"
                only_jpg: 0
              }
            ) {
              id
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors).toBeDefined();
          });
      });
    });

    describe('getUsers', () => {
      it('사용자 목록을 조회해야 합니다', () => {
        const query = `
          query {
            getUsers(offset: 0, limit: 10) {
              users {
                id
                user_id
                user_name
                email
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
            expect(res.body.data.getUsers).toBeDefined();
            expect(res.body.data.getUsers.count).toBeGreaterThanOrEqual(1);
            expect(Array.isArray(res.body.data.getUsers.users)).toBe(true);
          });
      });

      it('user_id로 사용자를 검색해야 합니다', () => {
        const query = `
          query {
            getUsers(offset: 0, limit: 10, user_id: "e2e_test") {
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
            expect(res.body.data.getUsers).toBeDefined();
          });
      });
    });

    describe('getUserById', () => {
      it('ID로 사용자를 조회해야 합니다', () => {
        const query = `
          query {
            getUserById(id: ${createdUserId}) {
              id
              user_id
              user_name
              email
              department {
                id
                name
              }
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getUserById).toBeDefined();
            expect(res.body.data.getUserById.id).toBe(createdUserId);
            expect(res.body.data.getUserById.user_id).toBe('e2e_test_user');
          });
      });

      it('존재하지 않는 사용자 조회 시 null을 반환해야 합니다', () => {
        const query = `
          query {
            getUserById(id: 999999) {
              id
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getUserById).toBeNull();
          });
      });
    });

    describe('updateUser', () => {
      it('사용자 정보를 수정해야 합니다', () => {
        const query = `
          mutation {
            updateUser(
              id: ${createdUserId}
              userInput: {
                grade: 2
                user_id: "e2e_test_user"
                pass: "updated1234"
                user_name: "수정된 E2E 사용자"
                email: "updated@example.com"
                department: ${createdDepartmentId}
                read_grade: "limited"
                write_grade: "limited"
                only_jpg: 1
              }
            ) {
              id
              user_name
              email
              grade
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateUser).toBeDefined();
            expect(res.body.data.updateUser.user_name).toBe(
              '수정된 E2E 사용자',
            );
            expect(res.body.data.updateUser.email).toBe('updated@example.com');
            expect(res.body.data.updateUser.grade).toBe(2);
          });
      });
    });

    describe('deleteUser', () => {
      it('사용자를 삭제해야 합니다', () => {
        const query = `
          mutation {
            deleteUser(id: ${createdUserId})
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteUser).toBe(true);
          });
      });

      it('삭제된 사용자 조회 시 null을 반환해야 합니다', () => {
        const query = `
          query {
            getUserById(id: ${createdUserId}) {
              id
            }
          }
        `;

        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getUserById).toBeNull();
          });
      });
    });
  });

  // ==================== Cleanup ====================
  describe('Cleanup', () => {
    it('테스트 부서를 삭제해야 합니다', () => {
      const query = `
        mutation {
          deleteDepartment(id: ${createdDepartmentId})
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteDepartment).toBe(true);
        });
    });
  });
});
