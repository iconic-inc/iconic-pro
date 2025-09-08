import { IRole } from './role.interface';
import { IUser, IUserBrief } from './user.interface';

export interface ISessionUser {
  user: {
    id: string;
    usr_email: string;
    usr_role: IRole;
  };
  tokens: { accessToken: string; refreshToken: string };
}

export interface IAuthContext {
  isLoggedIn: boolean;
  role: IRole | null;
  logout: () => Promise<void>;
}
