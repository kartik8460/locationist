export class User {
  email: string;
  password: string;
}
export class RegisterUser {
  name: string;
  email: string;
  password: string;
}
export class UserProfile{
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: Date;
  phone_no: number;
  gender: string;
  from: {
    city: string,
    state: string
  };
  about: string;
  isVerified: boolean;
  createdAt: Date;
  social: {
    instagram: string,
    youtube: string,
    facebook: string,
    twitter: string,
  };
  cover_pic: string;
  profile_pic: string;
}
