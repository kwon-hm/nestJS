import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

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
          .send({query})
          .expect((res) => {
            console.log(res.body)
          });
      });

      it('should create a user using createUser mutation', () => {
        const query = `
        
        `
      })
  })

  
});
