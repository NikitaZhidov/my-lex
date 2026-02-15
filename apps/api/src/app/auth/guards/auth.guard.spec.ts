import { ExecutionContext } from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../../users/users.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let usersService: UsersService;

  const mockUser = { id: 'user-1', name: 'John' };

  const mockRequest = {
    session: { userId: 'user-1' },
  };

  const createMockContext = (userId?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () =>
          (() => {
            mockRequest.session.userId = userId as string;
            return mockRequest;
          })(),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should throw UnauthorizedException if no userId', async () => {
    await expect(guard.canActivate(createMockContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      guard.canActivate(createMockContext('user-1')),
    ).rejects.toThrow(NotFoundException);
  });

  it('should attach user to request and return true', async () => {
    (usersService.findById as jest.Mock).mockImplementation(() => {
      return new Promise(res => res(mockUser));
    });

    const context = createMockContext('user-1');
    const result = await guard.canActivate(context);

    const req = context.switchToHttp().getRequest();

    expect(result).toBe(true);
    expect(req.user).toEqual(mockUser);
  });
});
