# NestJS GraphQL API - 사용자 및 부서 관리 시스템

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 📋 프로젝트 개요

NestJS, GraphQL, TypeORM을 사용한 사용자 및 부서 관리 시스템입니다.
객체 지향적이고 유지보수가 용이한 클린 아키텍처를 지향합니다.

## 🚀 주요 기능

- **GraphQL API**: Apollo Server를 통한 유연한 데이터 쿼리
- **사용자 관리**: CRUD 작업 (생성, 조회, 수정, 삭제)
- **부서 관리**: 부서 정보 관리 및 사용자 연동
- **데이터 검증**: class-validator를 통한 입력 값 검증
- **로깅 시스템**: Winston을 활용한 구조화된 로깅
- **API 문서화**: Swagger UI를 통한 API 문서 자동 생성
- **환경 변수 관리**: ConfigModule을 통한 안전한 설정 관리

## 🛠️ 기술 스택

- **Framework**: NestJS 10.x
- **언어**: TypeScript 5.x
- **GraphQL**: Apollo Server
- **ORM**: TypeORM
- **데이터베이스**: MySQL
- **로깅**: Winston
- **검증**: class-validator, class-transformer
- **문서화**: Swagger
- **패키지 매니저**: pnpm

## 📦 설치 방법

### 1. 저장소 클론 및 의존성 설치

```bash
# 의존성 설치
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=your_database_here
DB_SYNCHRONIZE=false
DB_LOGGING=true

# Application Configuration
PORT=3000
NODE_ENV=development
```

> 💡 **중요**: `.env.example` 파일을 참고하여 실제 데이터베이스 정보로 수정하세요.

### 3. 데이터베이스 준비

MySQL 데이터베이스를 생성하고 필요한 테이블을 설정하세요:

## 🏃 실행 방법

```bash
# 개발 모드 (watch mode)
pnpm run start:dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 모드
pnpm run start:prod

# 일반 실행
pnpm run start
```

## 🌐 접속 정보

애플리케이션 실행 후 다음 주소로 접속할 수 있습니다:

- **GraphQL Playground**: http://localhost:3000/graphql
- **API 문서 (Swagger)**: http://localhost:3000/api-docs
- **서버**: http://localhost:3000

## 📚 API 사용 예시

### GraphQL 쿼리 예시

#### 1. 사용자 목록 조회

```graphql
query {
  getUsers(offset: 0, limit: 10, user_id: null) {
    users {
      id
      user_id
      user_name
      email
      grade
      department {
        id
        name
      }
    }
    count
  }
}
```

#### 2. 특정 사용자 조회

```graphql
query {
  getUserById(id: 1) {
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
```

#### 3. 사용자 생성

```graphql
mutation {
  createUser(
    userInput: {
      grade: 1
      user_id: "john.doe"
      pass: "password123"
      user_name: "John Doe"
      email: "john@example.com"
      department: 1
      read_grade: "all"
      write_grade: "all"
      only_jpg: 0
    }
  ) {
    id
    user_id
    user_name
    email
  }
}
```

#### 4. 부서 목록 조회

```graphql
query {
  getDepartments(offset: 0, limit: 10, name: null) {
    departments {
      id
      name
    }
    count
  }
}
```

#### 5. 부서 생성

```graphql
mutation {
  createDepartment(createDepartmentInput: { name: "개발팀" }) {
    id
    name
  }
}
```

## 🧪 테스트

프로젝트는 포괄적인 단위 테스트와 E2E 테스트를 포함합니다.

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm run test

# 단위 테스트만 실행
pnpm run test -- --testPathPattern=spec.ts$

# E2E 테스트만 실행
pnpm run test:e2e

# Watch 모드
pnpm run test:watch

# 테스트 커버리지
pnpm run test:cov
```

### 테스트 구조

```
src/
├── user/
│   ├── user.service.spec.ts        # User Service 단위 테스트
│   └── user.resolver.spec.ts       # User Resolver 단위 테스트
├── department/
│   ├── department.service.spec.ts  # Department Service 단위 테스트
│   └── department.resolver.spec.ts # Department Resolver 단위 테스트
test/
└── app.e2e-spec.ts                 # E2E 테스트
```

### 테스트 커버리지

모든 주요 기능에 대한 테스트가 작성되어 있습니다:

- ✅ Service 계층 단위 테스트 (CRUD 작업)
- ✅ Resolver 계층 단위 테스트 (GraphQL 요청 처리)
- ✅ E2E 테스트 (전체 API 워크플로우)
- ✅ 에러 처리 및 유효성 검사 테스트

자세한 테스트 가이드는 [TESTING.md](./TESTING.md)를 참고하세요.

## 📁 프로젝트 구조

```
src/
├── app.module.ts              # 메인 애플리케이션 모듈
├── main.ts                    # 애플리케이션 진입점
├── common/                    # 공통 유틸리티
│   ├── date/                  # 날짜 관련 스칼라
│   ├── logger/                # Winston 로거 설정
│   └── types/                 # 공통 타입 정의
├── user/                      # 사용자 모듈
│   ├── dto/                   # 데이터 전송 객체
│   ├── entities/              # 사용자 엔티티
│   ├── user.module.ts         # 사용자 모듈
│   ├── user.resolver.ts       # GraphQL 리졸버
│   └── user.service.ts        # 비즈니스 로직
└── department/                # 부서 모듈
    ├── dto/                   # 데이터 전송 객체
    ├── entities/              # 부서 엔티티
    ├── department.module.ts   # 부서 모듈
    ├── department.resolver.ts # GraphQL 리졸버
    └── department.service.ts  # 비즈니스 로직
```

## 🔧 코드 품질

### 린팅 및 포맷팅

```bash
# ESLint 실행
pnpm run lint

# Prettier 포맷팅
pnpm run format
```

### 주요 개선 사항

- ✅ Entity와 DTO 명확히 분리
- ✅ 환경 변수를 통한 설정 관리
- ✅ ValidationPipe를 통한 입력 검증
- ✅ 적절한 에러 처리 및 HTTP 예외 사용
- ✅ TypeScript 타입 안정성 강화
- ✅ 일관된 코딩 스타일 및 네이밍 컨벤션
- ✅ 구조화된 로깅 시스템
- ✅ JSDoc 주석을 통한 코드 문서화

## 📝 주요 모듈 설명

### User Module (사용자 모듈)

- 사용자 정보 CRUD
- 부서와의 연관 관계 관리
- 로그인 실패 이력 추적

### Department Module (부서 모듈)

- 부서 정보 관리
- 사용자와의 연관 관계

### Logger Module (로거 모듈)

- Winston 기반 로깅
- 파일 및 콘솔 출력
- 요청 컨텍스트 추적

## 🔒 보안

- 환경 변수를 통한 민감 정보 관리
- ValidationPipe를 통한 입력 검증
- DTO whitelist를 통한 불필요한 속성 필터링
- 적절한 에러 메시지 처리

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is [MIT licensed](LICENSE).

## 💬 문의 및 지원

프로젝트에 대한 문의사항이나 버그 리포트는 이슈를 등록해주세요.

---

**Built with ❤️ using NestJS**
