import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

import {
  type CreateUser,
  Flashcard,
  type LoginUser,
  UserProfile,
} from '@my-lex/shared-models';

import { createFlashcard } from '../factories/flashcards-factories';
import { prisma } from '../factories/prisma';
import { createUser, mockUser } from '../factories/users-factories';

type ShortUserDto = Omit<CreateUser, 'passwordRepeat' | 'name'> &
  Partial<Pick<CreateUser, 'name'>>;

const registerUser = async (dto: ShortUserDto) => {
  const registerDto: CreateUser = {
    email: dto.email,
    name: dto.name ?? `randomName-${new Date().getTime()}`,
    password: dto.password,
    passwordRepeat: dto.password,
  };

  return await axios.post<boolean>('/api/auth/register', registerDto);
};

const getAuthAxios = () => {
  const jar = new CookieJar();
  return wrapper(axios.create({ jar }));
};

const getLoginDto = (dto: LoginUser) => dto;

describe('Auth tests', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('register and login works', async () => {
    const registerDto: ShortUserDto = {
      email: 'test@test.com',
      password: '123456789',
    };

    const registerRes = await registerUser(registerDto);

    expect(registerRes.status).toBe(HttpStatusCode.Created);
    expect(registerRes.data).toEqual(true);

    const loginRes = await axios.post(
      '/api/auth/login',
      getLoginDto({ email: registerDto.email, password: registerDto.password }),
    );
    expect(loginRes.status).toBe(HttpStatusCode.Ok);
  });

  it("should return the user's profile", async () => {
    const authAxios = getAuthAxios();

    await registerUser({
      email: mockUser.email,
      password: mockUser.password,
      name: mockUser.name,
    });

    await authAxios.post(
      '/api/auth/login',
      getLoginDto({ email: mockUser.email, password: mockUser.password }),
    );

    const profileRes = await authAxios.get<UserProfile>('/api/users/profile');

    expect(profileRes.data.email).toBe(mockUser.email);
  });
});

describe('Flashcards [Not authorized]', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.flashcard.deleteMany();
  });

  it('Forbids creating a flashcard if not authenticated', async () => {
    const flashcard: Flashcard = { term: 'Card', definition: 'def' };

    try {
      await axios.post(`/api/flashcards`, flashcard);
      throw new Error('Request should have failed');
    } catch (err: any) {
      expect(err.response.status).toBe(HttpStatusCode.Unauthorized);
    }
  });

  it('Forbids fetching flashcards if not authenticated', async () => {
    try {
      await axios.get(`/api/flashcards`);
      throw new Error('Request should have failed');
    } catch (err: any) {
      expect(err.response.status).toBe(HttpStatusCode.Unauthorized);
    }
  });

  it('Forbids deleting a flashcard if not authenticated', async () => {
    const existingUser = await createUser(mockUser);

    const flashcard = await createFlashcard(
      { term: 'term', definition: 'def' },
      existingUser.id,
    );

    try {
      await axios.delete(`/api/flashcards/${flashcard.id}`);
      throw new Error('Request should have failed');
    } catch (err: any) {
      expect(err.response.status).toBe(HttpStatusCode.Unauthorized);
    }
  });
});

describe('Flashcards [Authorized]', () => {
  let authAxios: AxiosInstance;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.flashcard.deleteMany();

    authAxios = getAuthAxios();

    await registerUser({
      email: mockUser.email,
      password: mockUser.password,
      name: mockUser.name,
    });

    await authAxios.post(
      '/api/auth/login',
      getLoginDto({ email: mockUser.email, password: mockUser.password }),
    );
  });

  beforeEach(async () => {
    await prisma.flashcard.deleteMany();
  });

  it('Should create a flashcard', async () => {
    const flashcard: Flashcard = { term: 'term', definition: 'def' };
    const res = await authAxios.post<Flashcard>('/api/flashcards', flashcard);

    expect(res.status).toBe(HttpStatusCode.Created);

    const userFlashcards = await authAxios.get<Flashcard[]>('/api/flashcards');

    expect(userFlashcards.data.length).toBe(1);
    expect(userFlashcards.data[0].term.trim()).toBe(flashcard.term.trim());
  });

  it('Should send all user cards', async () => {
    const profileRes = await authAxios.get<UserProfile>('/api/users/profile');

    const cards = await Promise.all([
      await createFlashcard(
        { term: 'card1', definition: 'def1' },
        profileRes.data.id,
      ),
      await createFlashcard(
        { term: 'card2', definition: 'def2' },
        profileRes.data.id,
      ),
      await createFlashcard(
        { term: 'card3', definition: 'def3' },
        profileRes.data.id,
      ),
      await createFlashcard(
        { term: 'card4', definition: 'def4' },
        profileRes.data.id,
      ),
    ]);

    const userFlashcards = await authAxios.get<Flashcard[]>('/api/flashcards');
    expect(userFlashcards.data.length).toBe(4);
    expect(cards.at(-1)?.term.trim()).toBe(
      userFlashcards.data.at(-1)?.term.trim(),
    );
  });

  it('Should delete a flashcard', async () => {
    const mockFlashcard: Flashcard = {
      term: 'Flashcard_1',
      definition: 'Definition_1',
    };
    const createdFlashCardRes = await authAxios.post<Flashcard>(
      '/api/flashcards',
      mockFlashcard,
    );

    const userFlashcards = await authAxios.get<Flashcard[]>('/api/flashcards');
    expect(userFlashcards.data.length).toBe(1);

    const deleteRes = await authAxios.delete<void>(
      `/api/flashcards/${createdFlashCardRes.data.id}`,
    );

    expect(deleteRes.status).toBe(HttpStatusCode.Ok);

    const newUserFlashcards =
      await authAxios.get<Flashcard[]>('/api/flashcards');
    expect(newUserFlashcards.data.length).toBe(0);
  });
});
