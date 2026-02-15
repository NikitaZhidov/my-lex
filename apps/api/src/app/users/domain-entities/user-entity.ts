export interface UserEntity {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  readonly password: string;
}
