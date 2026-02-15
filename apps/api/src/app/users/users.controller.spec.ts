import { Test, TestingModule } from '@nestjs/testing';

import { UserProfile } from '@my-lex/shared-models';

import { AuthGuard } from '../auth/guards/auth.guard';

import { UsersController } from './users.controller';

describe('UsersController', () => {
  const mockUser: UserProfile = {
    id: 'user-1',
    name: 'user-1',
    email: 'user@example.com',
    picture: null,
  };

  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user from @Authorized decorator', () => {
    const user = controller.getProfile(mockUser);
    expect(user).toEqual(mockUser);
  });
});
