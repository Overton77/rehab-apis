import { registerEnumType } from '@nestjs/graphql';

// ----------------- Enums -----------------

export enum InsuranceScope {
  ORG = 'ORG',
  CAMPUS = 'CAMPUS',
  PROGRAM = 'PROGRAM',
}

export enum NetworkStatus {
  UNKNOWN = 'UNKNOWN',
  IN_NETWORK = 'IN_NETWORK',
  OUT_OF_NETWORK = 'OUT_OF_NETWORK',
  CASE_BY_CASE = 'CASE_BY_CASE',
}

export enum WaitlistCategory {
  NONE = 'NONE',
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG',
}

export enum ReviewSource {
  INTERNAL = 'INTERNAL',
  GOOGLE = 'GOOGLE',
  HEALTHGRADES = 'HEALTHGRADES',
  FACEBOOK = 'FACEBOOK',
  OTHER = 'OTHER',
}

export enum ReviewerType {
  PATIENT = 'PATIENT',
  LOVED_ONE = 'LOVED_ONE',
  CLINICIAN = 'CLINICIAN',
  OTHER = 'OTHER',
}

export enum StoryType {
  PATIENT_STORY = 'PATIENT_STORY',
  FAMILY_STORY = 'FAMILY_STORY',
  PROGRAM_OVERVIEW = 'PROGRAM_OVERVIEW',
  ORIGIN_STORY = 'ORIGIN_STORY',
  OUTCOME_CASE = 'OUTCOME_CASE',
  OTHER = 'OTHER',
}

export enum LevelOfCareType {
  DETOX = 'DETOX',
  RESIDENTIAL = 'RESIDENTIAL',
  PHP = 'PHP',
  IOP = 'IOP',
  OUTPATIENT = 'OUTPATIENT',
  AFTERCARE = 'AFTERCARE',
  TELEHEALTH = 'TELEHEALTH',
  SOBER_LIVING = 'SOBER_LIVING',
  OTHER = 'OTHER',
}

// Register Enums with GraphQL

registerEnumType(InsuranceScope, { name: 'InsuranceScope' });
registerEnumType(NetworkStatus, { name: 'NetworkStatus' });
registerEnumType(WaitlistCategory, { name: 'WaitlistCategory' });
registerEnumType(ReviewSource, { name: 'ReviewSource' });
registerEnumType(ReviewerType, { name: 'ReviewerType' });
registerEnumType(StoryType, { name: 'StoryType' });
registerEnumType(LevelOfCareType, { name: 'LevelOfCareType' });
