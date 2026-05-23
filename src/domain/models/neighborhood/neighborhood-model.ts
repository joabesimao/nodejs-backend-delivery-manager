export interface Neighborhood {
  id: number;
  name: string;
  cityId: number;
  city?: { id: number; name: string };
}
