import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentResolver } from './department.resolver';
import { DepartmentService } from './department.service';
import { LoggerService } from '../common/logger/logger.service';
import { Department } from './entities/department';
import { CreateDepartmentInput } from './dto/departmentInput';

describe('DepartmentResolver', () => {
  let resolver: DepartmentResolver;
  let departmentService: DepartmentService;
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

  const mockDepartmentService = {
    getDepartments: jest.fn(),
    getDepartmentById: jest.fn(),
    createDepartment: jest.fn(),
    updateDepartment: jest.fn(),
    deleteDepartment: jest.fn(),
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
        DepartmentResolver,
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    resolver = module.get<DepartmentResolver>(DepartmentResolver);
    departmentService = module.get<DepartmentService>(DepartmentService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDepartments', () => {
    it('부서 목록을 반환해야 합니다', async () => {
      const mockResult = {
        departments: [mockDepartment],
        count: 1,
      };
      mockDepartmentService.getDepartments.mockResolvedValue(mockResult);

      const result = await resolver.getDepartments(0, 10, null, mockContext);

      expect(result).toEqual(mockResult);
      expect(mockDepartmentService.getDepartments).toHaveBeenCalledWith(
        0,
        10,
        null,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'getDepartments - name: null, offset: 0, limit: 10',
        mockContext,
      );
    });

    it('필터링된 부서 목록을 반환해야 합니다', async () => {
      const mockResult = {
        departments: [mockDepartment],
        count: 1,
      };
      mockDepartmentService.getDepartments.mockResolvedValue(mockResult);

      const result = await resolver.getDepartments(0, 10, 'Test', mockContext);

      expect(result).toEqual(mockResult);
      expect(mockDepartmentService.getDepartments).toHaveBeenCalledWith(
        0,
        10,
        'Test',
        mockContext,
      );
    });
  });

  describe('getDepartmentById', () => {
    it('ID로 부서를 조회해야 합니다', async () => {
      mockDepartmentService.getDepartmentById.mockResolvedValue(mockDepartment);

      const result = await resolver.getDepartmentById(1, mockContext);

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentService.getDepartmentById).toHaveBeenCalledWith(
        1,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'getDepartmentById - id: 1',
        mockContext,
      );
    });

    it('부서를 찾지 못하면 null을 반환해야 합니다', async () => {
      mockDepartmentService.getDepartmentById.mockResolvedValue(null);

      const result = await resolver.getDepartmentById(999, mockContext);

      expect(result).toBeNull();
      expect(mockDepartmentService.getDepartmentById).toHaveBeenCalledWith(
        999,
        mockContext,
      );
    });
  });

  describe('createDepartment', () => {
    it('새 부서를 생성해야 합니다', async () => {
      mockDepartmentService.createDepartment.mockResolvedValue(mockDepartment);

      const result = await resolver.createDepartment(
        mockDepartmentInput,
        mockContext,
      );

      expect(result).toEqual(mockDepartment);
      expect(mockDepartmentService.createDepartment).toHaveBeenCalledWith(
        mockDepartmentInput,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `createDepartment - departmentInput: ${JSON.stringify(mockDepartmentInput)}`,
        mockContext,
      );
    });
  });

  describe('updateDepartment', () => {
    it('부서 정보를 수정해야 합니다', async () => {
      const updatedDepartment = { ...mockDepartment, name: 'Updated Dept' };
      mockDepartmentService.updateDepartment.mockResolvedValue(
        updatedDepartment,
      );

      const result = await resolver.updateDepartment(
        1,
        mockDepartmentInput,
        mockContext,
      );

      expect(result).toEqual(updatedDepartment);
      expect(mockDepartmentService.updateDepartment).toHaveBeenCalledWith(
        1,
        mockDepartmentInput,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `updateDepartment - id: 1, departmentInput: ${JSON.stringify(mockDepartmentInput)}`,
        mockContext,
      );
    });
  });

  describe('deleteDepartment', () => {
    it('부서를 삭제해야 합니다', async () => {
      mockDepartmentService.deleteDepartment.mockResolvedValue(true);

      const result = await resolver.deleteDepartment(1, mockContext);

      expect(result).toBe(true);
      expect(mockDepartmentService.deleteDepartment).toHaveBeenCalledWith(
        1,
        mockContext,
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'deleteDepartment - id: 1',
        mockContext,
      );
    });
  });
});
