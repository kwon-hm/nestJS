import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { LoggerService } from '../common/logger/logger.service';
import { User } from './entities/user';
import { UserInput } from './dto/userInput';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let loggerService: LoggerService;

  const mockUser: User = {
    id: 1,
    grade: 1,
    user_id: 'test_user',
    pass: 'password123',
    user_name: 'Test User',
    email: 'test@example.com',
    read_grade: 'all',
    write_grade: 'all',
    only_jpg: 0,
    login_fail_count: 0,
    login_fail_time: null,
    department: {
      id: 1,
      name: 'Test Department',
    },
  };

  const mockUserInput: UserInput = {
    grade: 1,
    user_id: 'test_user',
    pass: 'password123',
    user_name: 'Test User',
    email: 'test@example.com',
    department: 1,
    read_grade: 'all',
    write_grade: 'all',
    only_jpg: 0,
  };

  const mockContext = {
    req: {
      logContext: {
        timestamp: '2024-01-01',
        url: '/graphql',
        ip: '127.0.0.1',
      },
    },
  };

  const mockUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('사용자 목록을 반환해야 합니다', async () => {
      const mockResult = {
        users: [mockUser],
        count: 1,
      };
      mockUserService.getUsers.mockResolvedValue(mockResult);

      const result = await resolver.getUsers(null, 0, 10, mockContext);

      expect(result).toEqual(mockResult);
      expect(mockUserService.getUsers).toHaveBeenCalledWith(
        0,
        10,
        null,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'getUsers - user_id: null, offset: 0, limit: 10',
        mockContext,
      );
    });

    it('필터링된 사용자 목록을 반환해야 합니다', async () => {
      const mockResult = {
        users: [mockUser],
        count: 1,
      };
      mockUserService.getUsers.mockResolvedValue(mockResult);

      const result = await resolver.getUsers('test', 0, 10, mockContext);

      expect(result).toEqual(mockResult);
      expect(mockUserService.getUsers).toHaveBeenCalledWith(
        0,
        10,
        'test',
        mockContext,
      );
    });
  });

  describe('getUserById', () => {
    it('ID로 사용자를 조회해야 합니다', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await resolver.getUserById(1, mockContext);

      expect(result).toEqual(mockUser);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1, mockContext);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'getUserById - id: 1',
        mockContext,
      );
    });

    it('사용자를 찾지 못하면 null을 반환해야 합니다', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const result = await resolver.getUserById(999, mockContext);

      expect(result).toBeNull();
      expect(mockUserService.getUserById).toHaveBeenCalledWith(
        999,
        mockContext,
      );
    });
  });

  describe('createUser', () => {
    it('새 사용자를 생성해야 합니다', async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await resolver.createUser(mockUserInput, mockContext);

      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        mockUserInput,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `createUser - userInput: ${JSON.stringify(mockUserInput)}`,
        mockContext,
      );
    });
  });

  describe('updateUser', () => {
    it('사용자 정보를 수정해야 합니다', async () => {
      const updatedUser = { ...mockUser, user_name: 'Updated User' };
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await resolver.updateUser(1, mockUserInput, mockContext);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        1,
        mockUserInput,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `updateUser - id: 1, userInput: ${JSON.stringify(mockUserInput)}`,
        mockContext,
      );
    });
  });

  describe('deleteUser', () => {
    it('사용자를 삭제해야 합니다', async () => {
      mockUserService.deleteUser.mockResolvedValue(true);

      const result = await resolver.deleteUser(1, mockContext);

      expect(result).toBe(true);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1, mockContext);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'deleteUser - id: 1',
        mockContext,
      );
    });
  });
});
