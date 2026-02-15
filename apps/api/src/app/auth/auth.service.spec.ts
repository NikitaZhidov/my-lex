import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../users/domain-entities/user-entity';
import { UsersRepository } from '../users/users.repository';

import { AuthService } from './auth.service';
import { LoginHandler } from './features/login-handler/login-handler';

describe('Auth service', () => {
  let authService: AuthService;

  const mockUsersRepository: Pick<
    UsersRepository,
    'findByEmail' | 'create' | 'findById'
  > = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockLoginHandler: LoginHandler = {
    persist: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('register: should throw an exception when trying to register a user with an email that already exists', async () => {
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue({
      email: 'email@e.com',
    });

    await expect(
      authService.register({
        email: 'email@exmaple.com',
        name: 'name',
        password: '',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('register: should modify password when creating a user', async () => {
    // Allow creating a user
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    const originalPassword = '123456';

    let createdPassword = '';

    const mockCreateUser: UsersRepository['create'] = user => {
      createdPassword = user.password;
      return new Promise(res => res({ ...user, id: 'user-1', picture: '' }));
    };

    (mockUsersRepository.create as jest.Mock).mockImplementation(
      mockCreateUser,
    );

    await authService.register({
      email: 'email@example.com',
      name: 'name',
      password: originalPassword,
    });

    expect(createdPassword).not.toEqual(originalPassword);
  });

  it('loginByCredentials: cannot login user with the email that does not exist', async () => {
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.loginByCredentials(
        {
          email: 'email@exmaple.com',
          password: '123456',
        },
        mockLoginHandler,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('loginByCredentials: login user if the password is correct', async () => {
    // Allow creating a user
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    let createdUser: UserEntity | null = null;

    const mockCreateUser: UsersRepository['create'] = async user => {
      createdUser = await new Promise(res =>
        res({ ...user, id: 'user-1', picture: '' }),
      );
      return createdUser as UserEntity;
    };

    (mockUsersRepository.create as jest.Mock).mockImplementation(
      mockCreateUser,
    );

    await authService.register({
      email: 'email@example.com',
      name: 'user',
      password: '123456',
    });

    // Allow to log in
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(
      createdUser,
    );

    await authService.loginByCredentials(
      { email: 'e@example.com', password: '123456' },
      mockLoginHandler,
    );

    expect(mockLoginHandler.persist as jest.Mock).toHaveBeenCalled();
  });

  it('loginByCredentials: cannot login user if the password is wrong', async () => {
    const correctPassword = '123456';
    const enteredPassword = '1234567';

    // Allow creating a user
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    let createdUser: UserEntity | null = null;

    const mockCreateUser: UsersRepository['create'] = async user => {
      createdUser = await new Promise(res =>
        res({ ...user, id: 'user-1', picture: '' }),
      );
      return createdUser as UserEntity;
    };

    (mockUsersRepository.create as jest.Mock).mockImplementation(
      mockCreateUser,
    );

    await authService.register({
      email: 'email@example.com',
      name: 'user',
      password: correctPassword,
    });

    // Allow to log in
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(
      createdUser,
    );

    expect(
      authService.loginByCredentials(
        { email: 'e@example.com', password: enteredPassword },
        mockLoginHandler,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('loginOrRegister: should create a user if the email does not exist and then log in', async () => {
    (mockUsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (mockUsersRepository.create as jest.Mock).mockImplementation(
      (): UserEntity => ({
        id: 'user-id',
        name: 'name',
        email: 'email@email.com',
        picture: null,
        password: '123456',
      }),
    );

    await authService.loginOrRegister(
      { email: 'new-user@example.com', name: 'user', picture: '', id: '123' },
      mockLoginHandler,
    );

    expect(mockUsersRepository.create).toHaveBeenCalled();
    expect(mockLoginHandler.persist).toHaveBeenCalled();
  });

  it('loginOrRegister: should login without creating a new user if the email already exists', async () => {
    (mockUsersRepository.findByEmail as jest.Mock).mockImplementation(
      (): UserEntity => ({
        id: 'user-id',
        name: 'user-name',
        email: 'user@email.com',
        picture: null,
        password: '123456',
      }),
    );

    await authService.loginOrRegister(
      { email: 'new-user@example.com', name: 'user', picture: '', id: '123' },
      mockLoginHandler,
    );

    expect(mockUsersRepository.create).not.toHaveBeenCalled();
    expect(mockLoginHandler.persist).toHaveBeenCalled();
  });

  it('logout: should logout', async () => {
    await authService.logout(mockLoginHandler);

    expect(mockLoginHandler.clear).toHaveBeenCalled();
  });
});
