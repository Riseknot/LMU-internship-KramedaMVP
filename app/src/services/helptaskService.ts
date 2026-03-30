/**
 * Frontend service for helptasks API
 * Handles all CRUD operations for helptasks
 */

export interface HelptaskCreatePayload {
  taskType: string;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: {
    zipCode?: string;
    city?: string;
    street?: string;
  };
  start: Date | string;
  end: Date | string;
  status?: "open" | "assigned" | "completed";
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
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: {
    zipCode?: string;
    city?: string;
    street?: string;
  };
  start?: Date | string;
  end?: Date | string;
  status?: "open" | "assigned" | "completed";
  assignedHelper?: string;
}

export interface Helptask {
  _id: string;
  taskType: string;
  title: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: {
    zipCode?: string;
    city?: string;
    street?: string;
  };
  start: string;
  end: string;
  status: "open" | "assigned" | "completed";
  assignedHelper?: string;
  firstname: string;
  surname: string;
  email: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = "/api/helptasks";

export const helptaskService = {
  /**
   * Fetch helptasks with optional filters
   */
  async getHelptasks(filters?: {
    firstname?: string;
    surname?: string;
    email?: string;
    status?: "open" | "assigned" | "completed";
    zipCode?: string;
    title?: string;
  }): Promise<Helptask[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.firstname) params.append("firstname", filters.firstname);
      if (filters?.surname) params.append("surname", filters.surname);
      if (filters?.email) params.append("email", filters.email);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.zipCode) params.append("zipCode", filters.zipCode);
      if (filters?.title) params.append("title", filters.title);

      const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching helptasks:", error);
      throw error;
    }
  },

  /**
   * Create a new helptask
   */
  async createHelptask(payload: HelptaskCreatePayload): Promise<Helptask> {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create helptask");
      }

      return response.json();
    } catch (error) {
      console.error("Error creating helptask:", error);
      throw error;
    }
  },

  /**
   * Update an existing helptask
   */
  async updateHelptask(
    id: string,
    payload: HelptaskUpdatePayload
  ): Promise<Helptask> {
    try {
      const response = await fetch(`${BASE_URL}?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update helptask");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating helptask:", error);
      throw error;
    }
  },
};
