/**
 * Frontend service for the Helptasks API.
 */

type GeoPoint = {
  type: "Point";
  coordinates: [number, number];
};
type AddressAsCircle = {
  lat: number;
  lng: number;
  radiusM: number;
}
type HelptaskStatus = "open" | "assigned" | "completed";
type HelptaskAddress = {
  zipCode?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
};

export type HelptaskFilters = Partial<{
  firstname: string;
  surname: string;
  email: string;
  status: HelptaskStatus;
  zipCode: string;
  title: string;
}>;

export interface HelptaskCreatePayload {
  taskType: string;
  title: string;
  description: string;
  public_loc?: AddressAsCircle;
  address: HelptaskAddress;
  start: Date | string;
  end: Date | string;
  status?: HelptaskStatus;
  assignedHelper?: string;
  firstname: string;
  surname: string;
  email: string;
  createdBy?: string;
}

export interface HelptaskUpdatePayload {
  taskType?: string;
  title?: string;
  description?: string;
  public_loc?: AddressAsCircle;
  address?: HelptaskAddress;
  start?: Date | string;
  end?: Date | string;
  status?: HelptaskStatus;
  assignedHelper?: string;
}

export interface Helptask {
  _id: string;
  taskType: string;
  title: string;
  description: string;
  public_loc: AddressAsCircle;
  location?: GeoPoint;
  address: HelptaskAddress;
  start: string;
  end: string;
  status: HelptaskStatus;
  assignedHelper?: string;
  firstname: string;
  surname: string;
  email: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "/api/helptasks";

const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `API error: ${response.statusText}`);
  }

  return data as T;
};

const buildUrl = (filters?: HelptaskFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const query = params.toString();
  return query ? `${BASE_URL}?${query}` : BASE_URL;
};

const jsonRequest = (method: "POST" | "PUT", body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const helptaskService = {
  getHelptasks: (filters?: HelptaskFilters) => requestJson<Helptask[]>(buildUrl(filters)),
  createHelptask: (payload: HelptaskCreatePayload) => requestJson<Helptask>(BASE_URL, jsonRequest("POST", payload)),
  updateHelptask: (id: string, payload: HelptaskUpdatePayload) =>
    requestJson<Helptask>(`${BASE_URL}?id=${encodeURIComponent(id)}`, jsonRequest("PUT", { id, ...payload })),
};
