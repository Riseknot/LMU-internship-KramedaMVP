import React, { useState } from 'react';
import { User } from '../types';
import MyProfile from './myprofile/MyProfile';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUserUpdate?: (updates: Partial<User>) => void;
}

export function ProfilePage({ user, onLogout, onUserUpdate }: ProfilePageProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mein Profil</h1>
        <p className="text-neutral-600">Verwalten Sie Ihre persönlichen Informationen</p>
      </div>

      <MyProfile user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />
    </div>
  );
}
