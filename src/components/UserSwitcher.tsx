import React from 'react';
import { User } from '../types';

interface UserSwitcherProps {
  users: User[];
  currentUser: User | null;
  onSwitchUser: (userId: string) => void;
}

export function UserSwitcher({ users, currentUser, onSwitchUser }: UserSwitcherProps) {
  return (
    null
  );
}
