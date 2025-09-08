import React from 'react';
import { IAuthContext } from '~/interfaces/auth.interface';
import { IRole } from '~/interfaces/role.interface';

const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  role: null,
  logout: async () => {},
});
export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const isAdmin = (role: IRole | null): boolean => {
  return role?.slug === 'admin';
};

export const isOwner = (role: IRole | null): boolean => {
  return role?.slug === 'spa-owner';
};

export const isClient = (role: IRole | null): boolean => {
  return role?.slug === 'client';
};
