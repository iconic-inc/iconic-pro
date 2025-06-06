import { IImage } from './image.interface';
import { IRole } from './role.interface';

export interface IUser {
  id: string;
  usr_username: string;
  usr_email: string;
  usr_firstName: string;
  usr_lastName: string;
  usr_slug: string;
  usr_address: string;
  usr_birthdate?: string;
  usr_msisdn: string;
  usr_sex?: string;
  usr_status: string;
  usr_avatar?: IImage;
  usr_role: IRole;
  createdAt: string;
  updatedAt: string;
}

export interface IUserBrief
  extends Pick<IUser, 'id' | 'usr_firstName' | 'usr_lastName' | 'usr_avatar'> {}

export interface IUserAttrs {
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  slug?: string;
  address: string;
  birthdate?: string;
  msisdn: string;
  sex: string;
  status?: string;
  avatar?: string;
  role?: string;
  password: string;
}

export interface IGoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface IFacebookProfile {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface IUserSocialLogin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
}
