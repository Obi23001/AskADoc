import { OrganizationTypes } from "./organization-types";
import { User } from "./user.model";

export interface Organization {
  organizationName: string;
  typeOfInstitution: OrganizationTypes;
  description: string;
  facilityCity: string;
  facilityAddress: string;
  phoneNumber: string;
  schedule: string;
  website: string;
  facilityEmailAddress: string;
  verified: boolean;
  user : User;
  [key: string]: any;
}
