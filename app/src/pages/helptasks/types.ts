export type HelptaskStatus = "open" | "assigned" | "completed";

export type HelptaskTab = "browse" | "create" | "manage";

export interface HelptaskSearchFilters {
  firstname: string;
  surname: string;
  status: HelptaskStatus;
}

export interface CreateHelptaskFormData {
  title: string;
  description: string;
  zipCode: string;
  city: string;
  street: string;
  streetNumber: string;
  start: string;
  end: string;
  requiredSkills: string[];
}
