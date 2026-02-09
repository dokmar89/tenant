export interface Room {
  id: string;
  n: string; // name
  a: number; // area
  f: number; // floor
}

export interface Tenant {
  id: number;
  name: string;
  ico: string;
  mail: string;
  price: number;
  disc: number;
  dep: number;
  net: boolean;
  cln: number; // Changed from boolean to number (price)
  furn: number;
  parkingPrice: number; // Custom price per spot
  contractFile?: string; // Name of the uploaded file
  rooms: string[]; // Array of Room IDs
  park: string[];  // Array of Parking IDs
}

export type Page = 'dash' | 'tenants' | 'rooms' | 'parking';