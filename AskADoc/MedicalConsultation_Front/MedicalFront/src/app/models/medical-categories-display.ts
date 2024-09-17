import { MedicalCategories } from './medical-categories';

export const MedicalCategoriesDisplay: { [key in MedicalCategories]: string } = {
  [MedicalCategories.INTERNAL_MEDICINE]: 'Internal Medicine',
  [MedicalCategories.PEDIATRICS]: 'Pediatrics',
  [MedicalCategories.SURGERY]: 'Surgery',
  [MedicalCategories.OBSTETRICS_AND_GYNECOLOGY]: 'Obstetrics and Gynecology',
  [MedicalCategories.CARDIOLOGY]: 'Cardiology',
  [MedicalCategories.DERMATOLOGY]: 'Dermatology',
  [MedicalCategories.NEUROLOGY]: 'Neurology',
  [MedicalCategories.PSYCHIATRY]: 'Psychiatry',
  [MedicalCategories.ONCOLOGY]: 'Oncology',
  [MedicalCategories.RADIOLOGY]: 'Radiology',
  [MedicalCategories.ANESTHESIOLOGY]: 'Anesthesiology',
  [MedicalCategories.EMERGENCY_MEDICINE]: 'Emergency Medicine',
  [MedicalCategories.PATHOLOGY]: 'Pathology',
  [MedicalCategories.ALLERGY_AND_IMMUNOLOGY]: 'Allergy and Immunology',
  [MedicalCategories.RHEUMATOLOGY]: 'Rheumatology',
  [MedicalCategories.GERIATRICS]: 'Geriatrics',
  [MedicalCategories.ENDOCRINOLOGY]: 'Endocrinology',
  [MedicalCategories.HEMATOLOGY]: 'Hematology',
  [MedicalCategories.NEPHROLOGY]: 'Nephrology',
  [MedicalCategories.UROLOGY]: 'Urology'
};
