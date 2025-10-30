import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user';
import { Department } from '../department/entities/department';
import { LoggerService } from '../common/logger/logger.service';
import { UserInput } from './dto/userInput';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let departmentRepository: Repository<Department>;
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

  const mockDepartment: Department = {
    id: 1,
    name: 'Test Department',
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

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockDepartmentRepository = {
    findOne: jest.fn(),
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
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Department),
          useValue: mockDepartmentRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    departmentRepository = module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('모든 사용자를 반환해야 합니다', async () => {
      const mockUsers = [mockUser];
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.getUsers(0, 10, null, mockContext);

      expect(result).toEqual({ users: mockUsers, count: 1 });
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['department'],
        where: {},
        skip: 0,
        take: 10,
      });
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Retrieved 1 users',
        mockContext,
      );
    });

    it('user_id 필터로 사용자를 검색해야 합니다', async () => {
      const mockUsers = [mockUser];
      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await service.getUsers(0, 10, 'test', mockContext);

      expect(result).toEqual({ users: mockUsers, count: 1 });
      expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            user_id: expect.any(Object),
          }),
        }),
      );
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockUserRepository.findAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getUsers(0, 10, null, mockContext)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('ID로 사용자를 찾아야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById(1, mockContext);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['department'],
      });
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Retrieved user with id: 1',
        mockContext,
      );
    });

    it('사용자를 찾지 못하면 null을 반환해야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserById(999, mockContext);

      expect(result).toBeNull();
      expect(mockLoggerService.log).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.getUserById(1, mockContext)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('새 사용자를 생성해야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(mockUserInput, mockContext);

      expect(result).toEqual(mockUser);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...mockUserInput,
        department: mockDepartment,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Created user with id: 1',
        mockContext,
      );
    });

    it('부서를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createUser(mockUserInput, mockContext),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.createUser(mockUserInput, mockContext),
      ).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('사용자 정보를 업데이트해야 합니다', async () => {
      const updatedUser = { ...mockUser, user_name: 'Updated User' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, mockUserInput, mockContext);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Updated user with id: 1',
        mockContext,
      );
    });

    it('사용자를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser(999, mockUserInput, mockContext),
      ).rejects.toThrow(NotFoundException);
    });

    it('부서를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockDepartmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateUser(1, mockUserInput, mockContext),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('사용자를 삭제해야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.deleteUser(1, mockContext);

      expect(result).toBe(true);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Deleted user with id: 1',
        mockContext,
      );
    });

    it('사용자를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser(999, mockContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.deleteUser(1, mockContext)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
