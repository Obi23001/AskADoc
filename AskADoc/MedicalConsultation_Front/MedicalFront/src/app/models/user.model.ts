import { Gender } from "./registration-request.model";
import { Role } from "./role.model";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  city: string;
  gender: Gender;
  roles: Role[];
  accountLocked: boolean;
  enabled: boolean;
  verified: boolean;
  profileImage?: string; // This will be a base64 encoded string in the frontend
  createdDate: Date;
  lastModifiedDate: Date;
}
