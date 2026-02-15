import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from './domain-entities/user-entity';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepostiory: UsersRepository;

  const mappedUserProfileDto = { _mapped: Symbol('mapped') };
  const mockUser: UserEntity = {
    id: 'user-1',
    name: 'user-1',
    email: 'user@example.com',
    picture: null,
    password: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersMapper,
          useValue: {
            toUserProfileDto: () => mappedUserProfileDto,
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepostiory = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById: should return null if id is missing', async () => {
    const user = await service.findById(undefined);
    expect(user).toBeNull();
  });

  it('findById: should return mapped user', async () => {
    (usersRepostiory.findById as jest.Mock).mockResolvedValue(mockUser);

    const resolvedUser = await service.findById('user-1');

    expect(resolvedUser).toEqual(mappedUserProfileDto);
    expect(usersRepostiory.findById).toHaveBeenCalled();
  });
});
