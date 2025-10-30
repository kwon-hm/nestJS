import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { DepartmentService } from './department.service';
import { Department } from './entities/department';
import { LoggerService } from '../common/logger/logger.service';
import { CreateDepartmentInput } from './dto/departmentInput';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let departmentRepository: Repository<Department>;
  let loggerService: LoggerService;

  const mockDepartment: Department = {
    id: 1,
    name: 'Test Department',
  };

  const mockDepartmentInput: CreateDepartmentInput = {
    name: 'Test Department',
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

  const mockDepartmentRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
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
        DepartmentService,
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

    service = module.get<DepartmentService>(DepartmentService);
    departmentRepository = module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDepartments', () => {
    it('모든 부서를 반환해야 합니다', async () => {
      const mockDepartments = [mockDepartment];
      mockDepartmentRepository.findAndCount.mockResolvedValue([
        mockDepartments,
        1,
      ]);

      const result = await service.getDepartments(0, 10, null, mockContext);

      expect(result).toEqual({ departments: mockDepartments, count: 1 });
      expect(mockDepartmentRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Retrieved 1 departments',
        mockContext,
      );
    });

    it('name 필터로 부서를 검색해야 합니다', async () => {
      const mockDepartments = [mockDepartment];
      mockDepartmentRepository.findAndCount.mockResolvedValue([
        mockDepartments,
        1,
      ]);

      const result = await service.getDepartments(0, 10, 'Test', mockContext);

      expect(result).toEqual({ departments: mockDepartments, count: 1 });
      expect(mockDepartmentRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.any(Object),
          }),
        }),
      );
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.findAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.getDepartments(0, 10, null, mockContext),
      ).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('getDepartmentById', () => {
    it('ID로 부서를 찾아야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);

      const result = await service.getDepartmentById(1, mockContext);

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Retrieved department with id: 1',
        mockContext,
      );
    });

    it('부서를 찾지 못하면 null을 반환해야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);

      const result = await service.getDepartmentById(999, mockContext);

      expect(result).toBeNull();
      expect(mockLoggerService.log).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getDepartmentById(1, mockContext)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('createDepartment', () => {
    it('새 부서를 생성해야 합니다', async () => {
      mockDepartmentRepository.create.mockReturnValue(mockDepartment);
      mockDepartmentRepository.save.mockResolvedValue(mockDepartment);

      const result = await service.createDepartment(
        mockDepartmentInput,
        mockContext,
      );

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentRepository.create).toHaveBeenCalledWith(
        mockDepartmentInput,
      );
      expect(mockDepartmentRepository.save).toHaveBeenCalledWith(
        mockDepartment,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Created department with id: 1',
        mockContext,
      );
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.create.mockReturnValue(mockDepartment);
      mockDepartmentRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.createDepartment(mockDepartmentInput, mockContext),
      ).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('updateDepartment', () => {
    it('부서 정보를 업데이트해야 합니다', async () => {
      const updatedDepartment = { ...mockDepartment, name: 'Updated Dept' };
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockDepartmentRepository.save.mockResolvedValue(updatedDepartment);

      const result = await service.updateDepartment(
        1,
        mockDepartmentInput,
        mockContext,
      );

      expect(result).toEqual(updatedDepartment);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockDepartmentRepository.save).toHaveBeenCalled();
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Updated department with id: 1',
        mockContext,
      );
    });

    it('부서를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateDepartment(999, mockDepartmentInput, mockContext),
      ).rejects.toThrow(NotFoundException);
      expect(mockDepartmentRepository.save).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockDepartmentRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.updateDepartment(1, mockDepartmentInput, mockContext),
      ).rejects.toThrow(InternalServerErrorException);
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });

  describe('deleteDepartment', () => {
    it('부서를 삭제해야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockDepartmentRepository.remove.mockResolvedValue(mockDepartment);

      const result = await service.deleteDepartment(1, mockContext);

      expect(result).toBe(true);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockDepartmentRepository.remove).toHaveBeenCalledWith(
        mockDepartment,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Deleted department with id: 1',
        mockContext,
      );
    });

    it('부서를 찾지 못하면 NotFoundException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteDepartment(999, mockContext)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockDepartmentRepository.remove).not.toHaveBeenCalled();
    });

    it('에러 발생 시 InternalServerErrorException을 던져야 합니다', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockDepartmentRepository.remove.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.deleteDepartment(1, mockContext)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLoggerService.error).toHaveBeenCalled();
    });
  });
});
