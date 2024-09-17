import { MedicalCategories } from './medical-categories';
import { User } from './user.model';

export interface Doctor extends User {
  speciality: MedicalCategories;
  education: string;
  workPlace: string;
  position: string;
  workExperienceYears: number;
  awards: string;
  contactPhone: string;
  contactEmail: string;
  aboutMe: string;
  specializationDetails: string;
  workExperienceDetails: string;
  furtherTraining: string;
  achievementsAndAwards: string;
  scientificWorks: string;
  verified: boolean;
  consultationFee: number;
  user : User;
  [key: string]: any; // Add this line to allow string indexing
}