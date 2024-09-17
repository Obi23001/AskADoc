import { OrganizationTypes } from "./organization-types";

export const OrganizationTypesDisplay: { [key in OrganizationTypes]: string } = {
  [OrganizationTypes.HOSPITAL]: 'Hospital',
  [OrganizationTypes.CLINIC]: 'Clinic',
  [OrganizationTypes.LABORATORY]: 'Laboratory',
  [OrganizationTypes.PHARMACY]: 'Pharmacy',
  [OrganizationTypes.REHABILITATION_CENTER]: 'Rehabilitation Center',
  [OrganizationTypes.NURSING_HOME]: 'Nursing Home',
  [OrganizationTypes.MEDICAL_RESEARCH_INSTITUTE]: 'Medical Research Institute',
  [OrganizationTypes.AMBULATORY_CARE_CENTER]: 'Ambulatory Care Center',
  [OrganizationTypes.DIAGNOSTIC_IMAGING_CENTER]: 'Diagnostic Imaging Center',
  [OrganizationTypes.MENTAL_HEALTH_FACILITY]: 'Mental Health Facility'
};
