# 테스트 가이드

이 문서는 NestJS GraphQL API 프로젝트의 테스트 코드 작성 및 실행 방법을 설명합니다.

## 📑 목차

- [테스트 개요](#테스트-개요)
- [테스트 실행 방법](#테스트-실행-방법)
- [단위 테스트](#단위-테스트)
  - [Service 테스트](#service-테스트)
  - [Resolver 테스트](#resolver-테스트)
- [E2E 테스트](#e2e-테스트)
- [테스트 커버리지](#테스트-커버리지)
- [테스트 작성 가이드라인](#테스트-작성-가이드라인)

---

## 🧪 테스트 개요

프로젝트는 다음 두 가지 유형의 테스트를 포함합니다:

1. **단위 테스트 (Unit Tests)**: 각 모듈(Service, Resolver)의 기능을 독립적으로 테스트
2. **E2E 테스트 (End-to-End Tests)**: 전체 API 워크플로우를 실제 환경과 유사하게 테스트

### 테스트 프레임워크

- **Jest**: 테스트 실행 및 단언(assertion)
- **Supertest**: HTTP 요청 테스트
- **@nestjs/testing**: NestJS 모듈 테스트 유틸리티

---

## 🚀 테스트 실행 방법

### 모든 테스트 실행

```bash
pnpm run test
```

### 단위 테스트만 실행

```bash
pnpm run test -- --testPathPattern=spec.ts$
```

### E2E 테스트만 실행

```bash
pnpm run test:e2e
```

### Watch 모드로 실행 (파일 변경 감지)

```bash
pnpm run test:watch
```

### 테스트 커버리지 확인

```bash
pnpm run test:cov
```

### 특정 파일 테스트

```bash
# User Service 테스트만 실행
pnpm run test -- user.service.spec.ts

# Department Resolver 테스트만 실행
pnpm run test -- department.resolver.spec.ts
```

---

## 📝 단위 테스트

### Service 테스트

Service 계층의 비즈니스 로직을 테스트합니다. Repository와 Logger를 Mock으로 대체하여 독립적인 테스트를 수행합니다.

#### 1. User Service 테스트 (`src/user/user.service.spec.ts`)

**테스트 범위:**

- ✅ 사용자 목록 조회 (getUsers)
- ✅ 사용자 ID로 조회 (getUserById)
- ✅ 사용자 생성 (createUser)
- ✅ 사용자 수정 (updateUser)
- ✅ 사용자 삭제 (deleteUser)

**주요 테스트 케이스:**

##### getUsers

```typescript
it('모든 사용자를 반환해야 합니다', async () => {
  const mockUsers = [mockUser];
  mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

  const result = await service.getUsers(0, 10, null, mockContext);

  expect(result).toEqual({ users: mockUsers, count: 1 });
  expect(mockLoggerService.log).toHaveBeenCalledWith(
    'Retrieved 1 users',
    mockContext,
  );
});
```

**테스트 내용:**

- 페이지네이션 파라미터를 전달하여 사용자 목록을 조회합니다
- 반환값이 users 배열과 count를 포함하는지 확인합니다
- 로거가 적절히 호출되었는지 검증합니다

##### getUserById

```typescript
it('ID로 사용자를 찾아야 합니다', async () => {
  mockUserRepository.findOne.mockResolvedValue(mockUser);

  const result = await service.getUserById(1, mockContext);

  expect(result).toEqual(mockUser);
  expect(mockUserRepository.findOne).toHaveBeenCalledWith({
    where: { id: 1 },
    relations: ['department'],
  });
});
```

**테스트 내용:**

- 특정 ID로 사용자를 조회합니다
- Department 관계가 포함되어 조회되는지 확인합니다
- 사용자를 찾지 못하면 null을 반환하는지 테스트합니다

##### createUser

```typescript
it('새 사용자를 생성해야 합니다', async () => {
  mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
  mockUserRepository.create.mockReturnValue(mockUser);
  mockUserRepository.save.mockResolvedValue(mockUser);

  const result = await service.createUser(mockUserInput, mockContext);

  expect(result).toEqual(mockUser);
  expect(mockDepartmentRepository.findOne).toHaveBeenCalled();
});
```

**테스트 내용:**

- 유효한 입력으로 사용자를 생성합니다
- 부서가 존재하지 않으면 NotFoundException이 발생하는지 확인합니다
- 생성된 사용자 정보가 올바르게 반환되는지 검증합니다

##### updateUser

```typescript
it('사용자 정보를 업데이트해야 합니다', async () => {
  mockUserRepository.findOne.mockResolvedValue(mockUser);
  mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
  mockUserRepository.save.mockResolvedValue(updatedUser);

  const result = await service.updateUser(1, mockUserInput, mockContext);

  expect(result).toEqual(updatedUser);
});
```

**테스트 내용:**

- 기존 사용자 정보를 수정합니다
- 사용자나 부서를 찾지 못하면 NotFoundException이 발생하는지 확인합니다
- 수정된 정보가 올바르게 저장되는지 검증합니다

##### deleteUser

```typescript
it('사용자를 삭제해야 합니다', async () => {
  mockUserRepository.findOne.mockResolvedValue(mockUser);
  mockUserRepository.remove.mockResolvedValue(mockUser);

  const result = await service.deleteUser(1, mockContext);

  expect(result).toBe(true);
});
```

**테스트 내용:**

- 사용자를 삭제하고 true를 반환합니다
- 삭제할 사용자를 찾지 못하면 NotFoundException이 발생하는지 확인합니다

---

#### 2. Department Service 테스트 (`src/department/department.service.spec.ts`)

**테스트 범위:**

- ✅ 부서 목록 조회 (getDepartments)
- ✅ 부서 ID로 조회 (getDepartmentById)
- ✅ 부서 생성 (createDepartment)
- ✅ 부서 수정 (updateDepartment)
- ✅ 부서 삭제 (deleteDepartment)

**주요 테스트 케이스:**

##### getDepartments

```typescript
it('모든 부서를 반환해야 합니다', async () => {
  const mockDepartments = [mockDepartment];
  mockDepartmentRepository.findAndCount.mockResolvedValue([mockDepartments, 1]);

  const result = await service.getDepartments(0, 10, null, mockContext);

  expect(result).toEqual({ departments: mockDepartments, count: 1 });
});
```

**테스트 내용:**

- 페이지네이션 파라미터로 부서 목록을 조회합니다
- name 필터로 부서를 검색할 수 있는지 확인합니다

##### createDepartment

```typescript
it('새 부서를 생성해야 합니다', async () => {
  mockDepartmentRepository.create.mockReturnValue(mockDepartment);
  mockDepartmentRepository.save.mockResolvedValue(mockDepartment);

  const result = await service.createDepartment(
    mockDepartmentInput,
    mockContext,
  );

  expect(result).toEqual(mockDepartment);
});
```

**테스트 내용:**

- 부서 이름으로 새 부서를 생성합니다
- 생성된 부서 정보가 올바르게 반환되는지 검증합니다

---

### Resolver 테스트

Resolver 계층은 GraphQL 요청을 처리하고 Service를 호출합니다. Service를 Mock으로 대체하여 테스트합니다.

#### 1. User Resolver 테스트 (`src/user/user.resolver.spec.ts`)

**테스트 범위:**

- ✅ getUsers Query
- ✅ getUserById Query
- ✅ createUser Mutation
- ✅ updateUser Mutation
- ✅ deleteUser Mutation

**주요 테스트 케이스:**

##### getUsers

```typescript
it('사용자 목록을 반환해야 합니다', async () => {
  const mockResult = { users: [mockUser], count: 1 };
  mockUserService.getUsers.mockResolvedValue(mockResult);

  const result = await resolver.getUsers(null, 0, 10, mockContext);

  expect(result).toEqual(mockResult);
  expect(mockUserService.getUsers).toHaveBeenCalledWith(
    0,
    10,
    null,
    mockContext,
  );
});
```

**테스트 내용:**

- GraphQL Query가 Service 메서드를 올바르게 호출하는지 확인합니다
- 로깅이 적절히 수행되는지 검증합니다
- 반환값이 올바른 형식인지 확인합니다

##### createUser

```typescript
it('새 사용자를 생성해야 합니다', async () => {
  mockUserService.createUser.mockResolvedValue(mockUser);

  const result = await resolver.createUser(mockUserInput, mockContext);

  expect(result).toEqual(mockUser);
  expect(mockUserService.createUser).toHaveBeenCalledWith(
    mockUserInput,
    mockContext,
  );
});
```

**테스트 내용:**

- GraphQL Mutation이 Service를 호출하는지 확인합니다
- 입력 데이터가 올바르게 전달되는지 검증합니다

---

#### 2. Department Resolver 테스트 (`src/department/department.resolver.spec.ts`)

**테스트 범위:**

- ✅ getDepartments Query
- ✅ getDepartmentById Query
- ✅ createDepartment Mutation
- ✅ updateDepartment Mutation
- ✅ deleteDepartment Mutation

User Resolver와 유사한 패턴으로 테스트합니다.

---

## 🌐 E2E 테스트

전체 API 워크플로우를 실제 환경과 유사하게 테스트합니다.

### E2E 테스트 파일: `test/app.e2e-spec.ts`

#### 테스트 구조

```typescript
describe('GraphQL API E2E Tests', () => {
  let app: INestApplication;
  let createdUserId: number;
  let createdDepartmentId: number;

  beforeAll(async () => {
    // 앱 초기화 및 ValidationPipe 설정
  });

  afterAll(async () => {
    // 앱 종료
  });

  describe('Department API', () => {
    // 부서 관련 E2E 테스트
  });

  describe('User API', () => {
    // 사용자 관련 E2E 테스트
  });

  describe('Cleanup', () => {
    // 테스트 데이터 정리
  });
});
```

### Department API E2E 테스트

#### 1. 부서 생성 테스트

```typescript
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
```

**테스트 내용:**

- GraphQL Mutation으로 부서를 생성합니다
- 생성된 부서의 ID를 저장하여 다음 테스트에서 사용합니다
- 응답 상태 코드가 200인지 확인합니다

#### 2. 부서 목록 조회 테스트

```typescript
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
      expect(res.body.data.getDepartments.count).toBeGreaterThanOrEqual(1);
    });
});
```

**테스트 내용:**

- 페이지네이션 파라미터로 부서 목록을 조회합니다
- 최소 1개 이상의 부서가 반환되는지 확인합니다

#### 3. 부서 검색 테스트

```typescript
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
  // ...
});
```

**테스트 내용:**

- name 파라미터로 부서를 필터링합니다
- Like 검색이 정상 작동하는지 확인합니다

#### 4. 부서 ID로 조회 테스트

```typescript
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
      expect(res.body.data.getDepartmentById.id).toBe(createdDepartmentId);
    });
});
```

**테스트 내용:**

- 이전에 생성한 부서의 ID로 조회합니다
- 올바른 부서 정보가 반환되는지 확인합니다

#### 5. 부서 수정 테스트

```typescript
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
      expect(res.body.data.updateDepartment.name).toBe('수정된테스트부서');
    });
});
```

**테스트 내용:**

- 부서 이름을 수정합니다
- 수정된 정보가 올바르게 반환되는지 확인합니다

---

### User API E2E 테스트

#### 1. 사용자 생성 테스트

```typescript
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
```

**테스트 내용:**

- 필수 필드를 모두 포함하여 사용자를 생성합니다
- Department 관계가 올바르게 설정되는지 확인합니다
- 생성된 사용자 ID를 저장합니다

#### 2. 유효성 검사 테스트

```typescript
it('유효하지 않은 이메일로 사용자 생성 시 에러가 발생해야 합니다', () => {
  const query = `
    mutation {
      createUser(
        userInput: {
          // ... 다른 필드들
          email: "invalid-email"  // 잘못된 이메일 형식
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
```

**테스트 내용:**

- ValidationPipe가 작동하는지 확인합니다
- 잘못된 이메일 형식으로 에러가 발생하는지 검증합니다

#### 3. 사용자 목록 조회 테스트

```typescript
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
```

**테스트 내용:**

- 페이지네이션이 정상 작동하는지 확인합니다
- 사용자 목록과 총 개수가 올바르게 반환되는지 검증합니다

#### 4. 사용자 검색 테스트

```typescript
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
  // ...
});
```

**테스트 내용:**

- Like 검색으로 사용자를 필터링합니다
- 부분 일치 검색이 정상 작동하는지 확인합니다

#### 5. 사용자 ID로 조회 테스트

```typescript
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
```

**테스트 내용:**

- 특정 사용자를 조회합니다
- Department 정보가 함께 로드되는지 확인합니다

#### 6. 존재하지 않는 사용자 조회 테스트

```typescript
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
```

**테스트 내용:**

- 존재하지 않는 ID로 조회 시 null을 반환하는지 확인합니다
- 에러가 아닌 null을 반환하는 것이 올바른 동작입니다

#### 7. 사용자 수정 테스트

```typescript
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
      expect(res.body.data.updateUser.user_name).toBe('수정된 E2E 사용자');
      expect(res.body.data.updateUser.email).toBe('updated@example.com');
      expect(res.body.data.updateUser.grade).toBe(2);
    });
});
```

**테스트 내용:**

- 사용자 정보를 수정합니다
- 수정된 모든 필드가 올바르게 반영되는지 확인합니다

#### 8. 사용자 삭제 테스트

```typescript
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
```

**테스트 내용:**

- 사용자를 삭제합니다
- 삭제 성공 시 true를 반환하는지 확인합니다

#### 9. 삭제된 사용자 조회 테스트

```typescript
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
```

**테스트 내용:**

- 삭제된 사용자가 더 이상 조회되지 않는지 확인합니다

---

### 테스트 데이터 정리 (Cleanup)

```typescript
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
```

**테스트 내용:**

- 테스트에서 생성한 모든 데이터를 정리합니다
- 데이터베이스를 깨끗한 상태로 유지합니다

---

## 📊 테스트 커버리지

### 커버리지 확인

```bash
pnpm run test:cov
```

### 커버리지 리포트

테스트 실행 후 `coverage/` 디렉토리에 리포트가 생성됩니다:

- `coverage/lcov-report/index.html`: HTML 형식의 커버리지 리포트

### 커버리지 목표

- **Statements**: 80% 이상
- **Branches**: 75% 이상
- **Functions**: 80% 이상
- **Lines**: 80% 이상

---

## ✅ 테스트 작성 가이드라인

### 1. 테스트 파일 네이밍

- 단위 테스트: `*.spec.ts`
- E2E 테스트: `*.e2e-spec.ts`

### 2. 테스트 구조

```typescript
describe('컴포넌트명', () => {
  // Setup
  beforeEach(() => {
    // 테스트 환경 설정
  });

  afterEach(() => {
    // Mock 초기화
  });

  describe('메서드명', () => {
    it('예상 동작을 설명하는 문장', () => {
      // Arrange: 테스트 데이터 준비
      // Act: 테스트 실행
      // Assert: 결과 검증
    });
  });
});
```

### 3. Mock 사용

- Repository, Service 등 외부 의존성은 Mock으로 대체
- `jest.fn()`을 사용하여 Mock 함수 생성
- `mockResolvedValue()`, `mockRejectedValue()` 사용

### 4. 에러 케이스 테스트

- 정상 케이스뿐만 아니라 에러 케이스도 반드시 테스트
- NotFoundException, InternalServerErrorException 등 예외 처리 검증

### 5. 테스트 독립성

- 각 테스트는 독립적으로 실행 가능해야 함
- 테스트 간 의존성이 없어야 함
- `afterEach`에서 Mock 초기화

---

## 🔍 디버깅 팁

### 1. 특정 테스트만 실행

```typescript
it.only('이 테스트만 실행됩니다', () => {
  // ...
});
```

### 2. 테스트 스킵

```typescript
it.skip('이 테스트는 스킵됩니다', () => {
  // ...
});
```

### 3. 디버그 모드로 실행

```bash
pnpm run test:debug
```

그리고 Chrome에서 `chrome://inspect`를 열어 디버깅합니다.

### 4. 로그 출력

```typescript
console.log(JSON.stringify(result, null, 2));
```

---

## 📚 추가 자료

- [Jest 공식 문서](https://jestjs.io/)
- [NestJS Testing 문서](https://docs.nestjs.com/fundamentals/testing)
- [Supertest GitHub](https://github.com/visionmedia/supertest)

---

**작성일**: 2024년  
**버전**: 1.0.0
