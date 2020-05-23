export interface LocationDetails {
  address: Address;
  loc: Loc;
  _id: string;
  name: string;
  description: string;
  cover_pic: string;
  phone_number: number;
  location_type: string;
  location_website: string;
}

interface Address {
  line_1: string;
  line_2: string;
  city: string;
  state_ut: string;
  zipcode: number;
}

interface Loc {
  type: string;
  coordinates: number[];
}

export interface Location {
  _id: string;
  name: string;
}

export interface LocationPreview {
  _id: string,
  name: string,
  cover_pic: string,
  address: string,
  location_type: string
}
