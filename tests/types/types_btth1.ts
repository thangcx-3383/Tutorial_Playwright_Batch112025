import { Gender, Hobby, Interest, Country } from "../enums/enum_btth1";

export const GENDER = Object.values(Gender);
export const HOBBIES = Object.values(Hobby);
export const INTERESTS = Object.values(Interest);
export const COUNTRIES = Object.values(Country);

export type GenderType = Gender;
export type HobbiesType = Hobby[];
export type InterestsType = Interest;
export type CountryType = Country;

export type UserDataType = {
  username?: string;
  email?: string;
  gender?: GenderType;
  hobbies?: HobbiesType;
  interests?: InterestsType;
  country?: CountryType;
  dateOfBirth?: string;
};
