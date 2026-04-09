import useSWR from 'swr';

type AuthUser = {
  id?: string;
  firstname?: string;
  surname?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: {
    zipCode?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
  };
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  languages?: string[];
  skills?: string[];
  bio?: string;
  avatarUrl?: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error('User konnte nicht geladen werden');
  }
  return response.json();
};

export function useUser() {
  const { data, error, isLoading } = useSWR<{ user?: AuthUser }>('/api/auth/me', fetcher);
  return { user: data?.user ?? null, isLoading, error };
}