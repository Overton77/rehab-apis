-- CreateEnum
CREATE TYPE "InsuranceScope" AS ENUM ('ORG', 'CAMPUS', 'PROGRAM');

-- CreateEnum
CREATE TYPE "NetworkStatus" AS ENUM ('UNKNOWN', 'IN_NETWORK', 'OUT_OF_NETWORK', 'CASE_BY_CASE');

-- CreateEnum
CREATE TYPE "WaitlistCategory" AS ENUM ('NONE', 'SHORT', 'MEDIUM', 'LONG');

-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('INTERNAL', 'GOOGLE', 'HEALTHGRADES', 'FACEBOOK', 'OTHER');

-- CreateEnum
CREATE TYPE "ReviewerType" AS ENUM ('PATIENT', 'LOVED_ONE', 'CLINICIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('PATIENT_STORY', 'FAMILY_STORY', 'PROGRAM_OVERVIEW', 'ORIGIN_STORY', 'OUTCOME_CASE', 'OTHER');

-- CreateEnum
CREATE TYPE "LevelOfCareType" AS ENUM ('DETOX', 'RESIDENTIAL', 'PHP', 'IOP', 'OUTPATIENT', 'AFTERCARE', 'TELEHEALTH', 'SOBER_LIVING', 'OTHER');

-- CreateTable
CREATE TABLE "prospective_rehabs" (
    "id" SERIAL NOT NULL,
    "npi_number" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "phone" TEXT,
    "taxonomy_code" TEXT,
    "taxonomy_desc" TEXT,
    "last_updated" TIMESTAMP(3),
    "ingested" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "prospective_rehabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_providers" (
    "id" SERIAL NOT NULL,
    "payer_code" TEXT NOT NULL,
    "payer_name" TEXT NOT NULL,
    "display_name" TEXT,
    "type" TEXT,
    "eligibility" TEXT,

    CONSTRAINT "insurance_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "description" TEXT,
    "verifiedExists" BOOLEAN NOT NULL DEFAULT false,
    "headquartersStreet" TEXT,
    "headquartersCity" TEXT,
    "headquartersState" TEXT,
    "headquartersPostalCode" TEXT,
    "headquartersCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeChannel" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "parentCompanyId" TEXT,
    "rehabOrgId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeVideo" (
    "id" TEXT NOT NULL,
    "channelId" TEXT,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaProfile" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "parentCompanyId" TEXT,
    "rehabOrgId" TEXT,
    "rehabCampusId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabOrg" (
    "id" TEXT NOT NULL,
    "parentCompanyId" TEXT,
    "state" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legalName" TEXT,
    "npi_number" TEXT,
    "description" TEXT,
    "tagline" TEXT,
    "websiteUrl" TEXT,
    "mainPhone" TEXT,
    "mainEmail" TEXT,
    "yearFounded" INTEGER,
    "isNonProfit" BOOLEAN DEFAULT false,
    "verifiedExists" BOOLEAN NOT NULL DEFAULT false,
    "primarySourceUrl" TEXT,
    "otherSourceUrls" TEXT[],
    "baseCurrency" TEXT,
    "fullPrivatePrice" INTEGER,
    "defaultTimeZone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RehabOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabCampus" (
    "id" TEXT NOT NULL,
    "rehabOrgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT,
    "description" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "timeZone" TEXT,
    "visitingHours" TEXT,
    "directionsSummary" TEXT,
    "bedsTotal" INTEGER,
    "bedsDetox" INTEGER,
    "bedsResidential" INTEGER,
    "bedsOutpatientCapacity" INTEGER,
    "acceptsWalkIns" BOOLEAN DEFAULT false,
    "hasOnsiteMD" BOOLEAN DEFAULT false,
    "hasTwentyFourHourNursing" BOOLEAN DEFAULT false,
    "primaryEnvironmentId" TEXT,
    "primarySettingStyleId" TEXT,
    "primaryLuxuryTierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RehabCampus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabProgram" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "levelOfCareId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT,
    "targetPopulationSummary" TEXT,
    "clinicalFocusSummary" TEXT,
    "minLengthOfStayDays" INTEGER,
    "maxLengthOfStayDays" INTEGER,
    "typicalLengthOfStayDays" INTEGER,
    "sessionScheduleSummary" TEXT,
    "checkInDays" TEXT[],
    "intakePhone" TEXT,
    "intakeEmail" TEXT,
    "isDetoxPrimary" BOOLEAN DEFAULT false,
    "isMATProgram" BOOLEAN DEFAULT false,
    "hasOnsiteMD" BOOLEAN DEFAULT false,
    "hasTwentyFourHourNursing" BOOLEAN DEFAULT false,
    "staffToPatientRatio" DOUBLE PRECISION,
    "acceptsSelfReferral" BOOLEAN DEFAULT true,
    "acceptsCourtOrdered" BOOLEAN DEFAULT false,
    "acceptsMedicallyComplex" BOOLEAN DEFAULT false,
    "waitlistCategory" "WaitlistCategory" NOT NULL DEFAULT 'NONE',
    "waitlistDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RehabProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelOfCare" (
    "id" TEXT NOT NULL,
    "type" "LevelOfCareType" NOT NULL DEFAULT 'OTHER',
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "LevelOfCare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetoxService" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DetoxService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MATType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "medicationClass" TEXT,
    "description" TEXT,

    CONSTRAINT "MATType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Population" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Population_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accreditation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Accreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingStyle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SettingStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LuxuryTier" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "rank" INTEGER,
    "description" TEXT,

    CONSTRAINT "LuxuryTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramFeature" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProgramFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOption" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePayer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "payerType" TEXT,

    CONSTRAINT "InsurancePayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substance" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,

    CONSTRAINT "Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabLevelOfCare" (
    "rehabId" TEXT NOT NULL,
    "levelOfCareId" TEXT NOT NULL,

    CONSTRAINT "RehabLevelOfCare_pkey" PRIMARY KEY ("rehabId","levelOfCareId")
);

-- CreateTable
CREATE TABLE "RehabDetoxService" (
    "rehabId" TEXT NOT NULL,
    "detoxServiceId" TEXT NOT NULL,

    CONSTRAINT "RehabDetoxService_pkey" PRIMARY KEY ("rehabId","detoxServiceId")
);

-- CreateTable
CREATE TABLE "RehabService" (
    "rehabId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "RehabService_pkey" PRIMARY KEY ("rehabId","serviceId")
);

-- CreateTable
CREATE TABLE "RehabPopulation" (
    "rehabId" TEXT NOT NULL,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "RehabPopulation_pkey" PRIMARY KEY ("rehabId","populationId")
);

-- CreateTable
CREATE TABLE "RehabAccreditation" (
    "rehabId" TEXT NOT NULL,
    "accreditationId" TEXT NOT NULL,

    CONSTRAINT "RehabAccreditation_pkey" PRIMARY KEY ("rehabId","accreditationId")
);

-- CreateTable
CREATE TABLE "RehabLanguage" (
    "rehabId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "RehabLanguage_pkey" PRIMARY KEY ("rehabId","languageId")
);

-- CreateTable
CREATE TABLE "RehabAmenity" (
    "rehabId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "RehabAmenity_pkey" PRIMARY KEY ("rehabId","amenityId")
);

-- CreateTable
CREATE TABLE "RehabEnvironment" (
    "rehabId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "RehabEnvironment_pkey" PRIMARY KEY ("rehabId","environmentId")
);

-- CreateTable
CREATE TABLE "RehabSettingStyle" (
    "rehabId" TEXT NOT NULL,
    "settingStyleId" TEXT NOT NULL,

    CONSTRAINT "RehabSettingStyle_pkey" PRIMARY KEY ("rehabId","settingStyleId")
);

-- CreateTable
CREATE TABLE "RehabLuxuryTier" (
    "rehabId" TEXT NOT NULL,
    "luxuryTierId" TEXT NOT NULL,

    CONSTRAINT "RehabLuxuryTier_pkey" PRIMARY KEY ("rehabId","luxuryTierId")
);

-- CreateTable
CREATE TABLE "RehabProgramFeatureGlobal" (
    "rehabId" TEXT NOT NULL,
    "programFeatureId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramFeatureGlobal_pkey" PRIMARY KEY ("rehabId","programFeatureId")
);

-- CreateTable
CREATE TABLE "RehabCampusAmenity" (
    "campusId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusAmenity_pkey" PRIMARY KEY ("campusId","amenityId")
);

-- CreateTable
CREATE TABLE "RehabCampusLanguage" (
    "campusId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusLanguage_pkey" PRIMARY KEY ("campusId","languageId")
);

-- CreateTable
CREATE TABLE "RehabCampusPopulation" (
    "campusId" TEXT NOT NULL,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusPopulation_pkey" PRIMARY KEY ("campusId","populationId")
);

-- CreateTable
CREATE TABLE "RehabCampusEnvironment" (
    "campusId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusEnvironment_pkey" PRIMARY KEY ("campusId","environmentId")
);

-- CreateTable
CREATE TABLE "RehabCampusSettingStyle" (
    "campusId" TEXT NOT NULL,
    "settingStyleId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusSettingStyle_pkey" PRIMARY KEY ("campusId","settingStyleId")
);

-- CreateTable
CREATE TABLE "RehabCampusLuxuryTier" (
    "campusId" TEXT NOT NULL,
    "luxuryTierId" TEXT NOT NULL,

    CONSTRAINT "RehabCampusLuxuryTier_pkey" PRIMARY KEY ("campusId","luxuryTierId")
);

-- CreateTable
CREATE TABLE "RehabProgramDetoxService" (
    "programId" TEXT NOT NULL,
    "detoxServiceId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramDetoxService_pkey" PRIMARY KEY ("programId","detoxServiceId")
);

-- CreateTable
CREATE TABLE "RehabProgramMATType" (
    "programId" TEXT NOT NULL,
    "matTypeId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramMATType_pkey" PRIMARY KEY ("programId","matTypeId")
);

-- CreateTable
CREATE TABLE "RehabProgramService" (
    "programId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramService_pkey" PRIMARY KEY ("programId","serviceId")
);

-- CreateTable
CREATE TABLE "RehabProgramPopulation" (
    "programId" TEXT NOT NULL,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramPopulation_pkey" PRIMARY KEY ("programId","populationId")
);

-- CreateTable
CREATE TABLE "RehabProgramLanguage" (
    "programId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramLanguage_pkey" PRIMARY KEY ("programId","languageId")
);

-- CreateTable
CREATE TABLE "RehabProgramAmenity" (
    "programId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramAmenity_pkey" PRIMARY KEY ("programId","amenityId")
);

-- CreateTable
CREATE TABLE "RehabProgramFeature" (
    "programId" TEXT NOT NULL,
    "programFeatureId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramFeature_pkey" PRIMARY KEY ("programId","programFeatureId")
);

-- CreateTable
CREATE TABLE "RehabProgramSubstance" (
    "programId" TEXT NOT NULL,
    "substanceId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramSubstance_pkey" PRIMARY KEY ("programId","substanceId")
);

-- CreateTable
CREATE TABLE "RehabInsurancePayer" (
    "id" TEXT NOT NULL,
    "rehabId" TEXT NOT NULL,
    "campusId" TEXT,
    "programId" TEXT,
    "insurancePayerId" TEXT NOT NULL,
    "scope" "InsuranceScope" NOT NULL DEFAULT 'ORG',
    "networkStatus" "NetworkStatus" NOT NULL DEFAULT 'UNKNOWN',
    "averageAdmissionPrice" INTEGER,
    "estimatedPatientOopMin" INTEGER,
    "estimatedPatientOopMax" INTEGER,
    "requiresPreauth" BOOLEAN,
    "acceptsOutOfNetworkWithOopCap" BOOLEAN,
    "notes" TEXT,
    "overview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RehabInsurancePayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabPaymentOption" (
    "id" TEXT NOT NULL,
    "rehabId" TEXT NOT NULL,
    "campusId" TEXT,
    "programId" TEXT,
    "paymentOptionId" TEXT NOT NULL,
    "descriptionOverride" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RehabPaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgReview" (
    "id" TEXT NOT NULL,
    "rehabOrgId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "reviewerType" "ReviewerType" NOT NULL DEFAULT 'OTHER',
    "reviewerName" TEXT,
    "reviewerRole" TEXT,
    "source" "ReviewSource" NOT NULL DEFAULT 'INTERNAL',
    "externalUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgTestimonial" (
    "id" TEXT NOT NULL,
    "rehabOrgId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "attributionName" TEXT,
    "attributionRole" TEXT,
    "source" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgStory" (
    "id" TEXT NOT NULL,
    "rehabOrgId" TEXT NOT NULL,
    "storyType" "StoryType" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusReview" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "reviewerType" "ReviewerType" NOT NULL DEFAULT 'OTHER',
    "reviewerName" TEXT,
    "reviewerRole" TEXT,
    "source" "ReviewSource" NOT NULL DEFAULT 'INTERNAL',
    "externalUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusTestimonial" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "attributionName" TEXT,
    "attributionRole" TEXT,
    "source" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusStory" (
    "id" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "storyType" "StoryType" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramReview" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "reviewerType" "ReviewerType" NOT NULL DEFAULT 'OTHER',
    "reviewerName" TEXT,
    "reviewerRole" TEXT,
    "source" "ReviewSource" NOT NULL DEFAULT 'INTERNAL',
    "externalUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTestimonial" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "attributionName" TEXT,
    "attributionRole" TEXT,
    "source" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramStory" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "storyType" "StoryType" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prospective_rehabs_npi_number_key" ON "prospective_rehabs"("npi_number");

-- CreateIndex
CREATE INDEX "prospective_rehabs_npi_number_idx" ON "prospective_rehabs"("npi_number");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_providers_payer_code_key" ON "insurance_providers"("payer_code");

-- CreateIndex
CREATE INDEX "insurance_providers_payer_code_idx" ON "insurance_providers"("payer_code");

-- CreateIndex
CREATE UNIQUE INDEX "ParentCompany_slug_key" ON "ParentCompany"("slug");

-- CreateIndex
CREATE INDEX "YoutubeChannel_parentCompanyId_idx" ON "YoutubeChannel"("parentCompanyId");

-- CreateIndex
CREATE INDEX "YoutubeChannel_rehabOrgId_idx" ON "YoutubeChannel"("rehabOrgId");

-- CreateIndex
CREATE INDEX "YoutubeVideo_channelId_idx" ON "YoutubeVideo"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "RehabOrg_slug_key" ON "RehabOrg"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RehabCampus_slug_key" ON "RehabCampus"("slug");

-- CreateIndex
CREATE INDEX "RehabCampus_rehabOrgId_idx" ON "RehabCampus"("rehabOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "RehabProgram_slug_key" ON "RehabProgram"("slug");

-- CreateIndex
CREATE INDEX "RehabProgram_campusId_idx" ON "RehabProgram"("campusId");

-- CreateIndex
CREATE INDEX "RehabProgram_levelOfCareId_idx" ON "RehabProgram"("levelOfCareId");

-- CreateIndex
CREATE UNIQUE INDEX "LevelOfCare_slug_key" ON "LevelOfCare"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DetoxService_slug_key" ON "DetoxService"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MATType_slug_key" ON "MATType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Population_slug_key" ON "Population"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Accreditation_slug_key" ON "Accreditation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_slug_key" ON "Amenity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_slug_key" ON "Environment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SettingStyle_slug_key" ON "SettingStyle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LuxuryTier_slug_key" ON "LuxuryTier"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramFeature_slug_key" ON "ProgramFeature"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOption_slug_key" ON "PaymentOption"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePayer_slug_key" ON "InsurancePayer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_slug_key" ON "Substance"("slug");

-- CreateIndex
CREATE INDEX "RehabInsurancePayer_rehabId_idx" ON "RehabInsurancePayer"("rehabId");

-- CreateIndex
CREATE INDEX "RehabInsurancePayer_campusId_idx" ON "RehabInsurancePayer"("campusId");

-- CreateIndex
CREATE INDEX "RehabInsurancePayer_programId_idx" ON "RehabInsurancePayer"("programId");

-- CreateIndex
CREATE INDEX "RehabInsurancePayer_insurancePayerId_idx" ON "RehabInsurancePayer"("insurancePayerId");

-- CreateIndex
CREATE INDEX "RehabPaymentOption_rehabId_idx" ON "RehabPaymentOption"("rehabId");

-- CreateIndex
CREATE INDEX "RehabPaymentOption_campusId_idx" ON "RehabPaymentOption"("campusId");

-- CreateIndex
CREATE INDEX "RehabPaymentOption_programId_idx" ON "RehabPaymentOption"("programId");

-- CreateIndex
CREATE INDEX "RehabPaymentOption_paymentOptionId_idx" ON "RehabPaymentOption"("paymentOptionId");

-- CreateIndex
CREATE INDEX "OrgReview_rehabOrgId_idx" ON "OrgReview"("rehabOrgId");

-- CreateIndex
CREATE INDEX "OrgTestimonial_rehabOrgId_idx" ON "OrgTestimonial"("rehabOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgStory_slug_key" ON "OrgStory"("slug");

-- CreateIndex
CREATE INDEX "OrgStory_rehabOrgId_idx" ON "OrgStory"("rehabOrgId");

-- CreateIndex
CREATE INDEX "CampusReview_campusId_idx" ON "CampusReview"("campusId");

-- CreateIndex
CREATE INDEX "CampusTestimonial_campusId_idx" ON "CampusTestimonial"("campusId");

-- CreateIndex
CREATE UNIQUE INDEX "CampusStory_slug_key" ON "CampusStory"("slug");

-- CreateIndex
CREATE INDEX "CampusStory_campusId_idx" ON "CampusStory"("campusId");

-- CreateIndex
CREATE INDEX "ProgramReview_programId_idx" ON "ProgramReview"("programId");

-- CreateIndex
CREATE INDEX "ProgramTestimonial_programId_idx" ON "ProgramTestimonial"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramStory_slug_key" ON "ProgramStory"("slug");

-- CreateIndex
CREATE INDEX "ProgramStory_programId_idx" ON "ProgramStory"("programId");

-- AddForeignKey
ALTER TABLE "YoutubeChannel" ADD CONSTRAINT "YoutubeChannel_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "ParentCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeChannel" ADD CONSTRAINT "YoutubeChannel_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "YoutubeChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaProfile" ADD CONSTRAINT "SocialMediaProfile_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "ParentCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaProfile" ADD CONSTRAINT "SocialMediaProfile_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaProfile" ADD CONSTRAINT "SocialMediaProfile_rehabCampusId_fkey" FOREIGN KEY ("rehabCampusId") REFERENCES "RehabCampus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabOrg" ADD CONSTRAINT "RehabOrg_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "ParentCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampus" ADD CONSTRAINT "RehabCampus_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampus" ADD CONSTRAINT "RehabCampus_primaryEnvironmentId_fkey" FOREIGN KEY ("primaryEnvironmentId") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampus" ADD CONSTRAINT "RehabCampus_primarySettingStyleId_fkey" FOREIGN KEY ("primarySettingStyleId") REFERENCES "SettingStyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampus" ADD CONSTRAINT "RehabCampus_primaryLuxuryTierId_fkey" FOREIGN KEY ("primaryLuxuryTierId") REFERENCES "LuxuryTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgram" ADD CONSTRAINT "RehabProgram_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgram" ADD CONSTRAINT "RehabProgram_levelOfCareId_fkey" FOREIGN KEY ("levelOfCareId") REFERENCES "LevelOfCare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLevelOfCare" ADD CONSTRAINT "RehabLevelOfCare_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLevelOfCare" ADD CONSTRAINT "RehabLevelOfCare_levelOfCareId_fkey" FOREIGN KEY ("levelOfCareId") REFERENCES "LevelOfCare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabDetoxService" ADD CONSTRAINT "RehabDetoxService_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabDetoxService" ADD CONSTRAINT "RehabDetoxService_detoxServiceId_fkey" FOREIGN KEY ("detoxServiceId") REFERENCES "DetoxService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabService" ADD CONSTRAINT "RehabService_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabService" ADD CONSTRAINT "RehabService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPopulation" ADD CONSTRAINT "RehabPopulation_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPopulation" ADD CONSTRAINT "RehabPopulation_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "Population"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAccreditation" ADD CONSTRAINT "RehabAccreditation_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAccreditation" ADD CONSTRAINT "RehabAccreditation_accreditationId_fkey" FOREIGN KEY ("accreditationId") REFERENCES "Accreditation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLanguage" ADD CONSTRAINT "RehabLanguage_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLanguage" ADD CONSTRAINT "RehabLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAmenity" ADD CONSTRAINT "RehabAmenity_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAmenity" ADD CONSTRAINT "RehabAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabEnvironment" ADD CONSTRAINT "RehabEnvironment_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabEnvironment" ADD CONSTRAINT "RehabEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabSettingStyle" ADD CONSTRAINT "RehabSettingStyle_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabSettingStyle" ADD CONSTRAINT "RehabSettingStyle_settingStyleId_fkey" FOREIGN KEY ("settingStyleId") REFERENCES "SettingStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLuxuryTier" ADD CONSTRAINT "RehabLuxuryTier_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLuxuryTier" ADD CONSTRAINT "RehabLuxuryTier_luxuryTierId_fkey" FOREIGN KEY ("luxuryTierId") REFERENCES "LuxuryTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeatureGlobal" ADD CONSTRAINT "RehabProgramFeatureGlobal_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeatureGlobal" ADD CONSTRAINT "RehabProgramFeatureGlobal_programFeatureId_fkey" FOREIGN KEY ("programFeatureId") REFERENCES "ProgramFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusAmenity" ADD CONSTRAINT "RehabCampusAmenity_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusAmenity" ADD CONSTRAINT "RehabCampusAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusLanguage" ADD CONSTRAINT "RehabCampusLanguage_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusLanguage" ADD CONSTRAINT "RehabCampusLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusPopulation" ADD CONSTRAINT "RehabCampusPopulation_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusPopulation" ADD CONSTRAINT "RehabCampusPopulation_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "Population"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusEnvironment" ADD CONSTRAINT "RehabCampusEnvironment_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusEnvironment" ADD CONSTRAINT "RehabCampusEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusSettingStyle" ADD CONSTRAINT "RehabCampusSettingStyle_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusSettingStyle" ADD CONSTRAINT "RehabCampusSettingStyle_settingStyleId_fkey" FOREIGN KEY ("settingStyleId") REFERENCES "SettingStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusLuxuryTier" ADD CONSTRAINT "RehabCampusLuxuryTier_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabCampusLuxuryTier" ADD CONSTRAINT "RehabCampusLuxuryTier_luxuryTierId_fkey" FOREIGN KEY ("luxuryTierId") REFERENCES "LuxuryTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramDetoxService" ADD CONSTRAINT "RehabProgramDetoxService_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramDetoxService" ADD CONSTRAINT "RehabProgramDetoxService_detoxServiceId_fkey" FOREIGN KEY ("detoxServiceId") REFERENCES "DetoxService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramMATType" ADD CONSTRAINT "RehabProgramMATType_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramMATType" ADD CONSTRAINT "RehabProgramMATType_matTypeId_fkey" FOREIGN KEY ("matTypeId") REFERENCES "MATType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramService" ADD CONSTRAINT "RehabProgramService_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramService" ADD CONSTRAINT "RehabProgramService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramPopulation" ADD CONSTRAINT "RehabProgramPopulation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramPopulation" ADD CONSTRAINT "RehabProgramPopulation_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "Population"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramLanguage" ADD CONSTRAINT "RehabProgramLanguage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramLanguage" ADD CONSTRAINT "RehabProgramLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramAmenity" ADD CONSTRAINT "RehabProgramAmenity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramAmenity" ADD CONSTRAINT "RehabProgramAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeature" ADD CONSTRAINT "RehabProgramFeature_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeature" ADD CONSTRAINT "RehabProgramFeature_programFeatureId_fkey" FOREIGN KEY ("programFeatureId") REFERENCES "ProgramFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramSubstance" ADD CONSTRAINT "RehabProgramSubstance_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramSubstance" ADD CONSTRAINT "RehabProgramSubstance_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_insurancePayerId_fkey" FOREIGN KEY ("insurancePayerId") REFERENCES "InsurancePayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_paymentOptionId_fkey" FOREIGN KEY ("paymentOptionId") REFERENCES "PaymentOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgReview" ADD CONSTRAINT "OrgReview_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgTestimonial" ADD CONSTRAINT "OrgTestimonial_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgStory" ADD CONSTRAINT "OrgStory_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusReview" ADD CONSTRAINT "CampusReview_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusTestimonial" ADD CONSTRAINT "CampusTestimonial_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusStory" ADD CONSTRAINT "CampusStory_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramReview" ADD CONSTRAINT "ProgramReview_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTestimonial" ADD CONSTRAINT "ProgramTestimonial_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramStory" ADD CONSTRAINT "ProgramStory_programId_fkey" FOREIGN KEY ("programId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
