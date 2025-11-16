-- CreateEnum
CREATE TYPE "ServiceKind" AS ENUM ('COUNSELING_TYPE', 'THERAPY_MODEL', 'OTHER');

-- CreateEnum
CREATE TYPE "PopulationCategory" AS ENUM ('AGE_GROUP', 'MILITARY', 'FAMILY', 'IDENTITY', 'LIFE_STAGE', 'SPECIALTY_PROGRAM');

-- CreateEnum
CREATE TYPE "AmenityCategory" AS ENUM ('LODGING', 'FOOD', 'TECH', 'TRANSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ProgramFeatureCategory" AS ENUM ('ADMISSION', 'ACCESS', 'STAFFING', 'VA', 'WORK_LIFE', 'OTHER');

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
CREATE TABLE "Rehab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "npi_number" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "verifiedExists" BOOLEAN NOT NULL DEFAULT false,
    "primarySourceUrl" TEXT,
    "otherSourceUrls" TEXT[],
    "fullPrivatePrice" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rehab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePayer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InsurancePayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabInsurancePayer" (
    "rehabId" TEXT NOT NULL,
    "insurancePayerId" TEXT NOT NULL,
    "averageAdmissionPrice" DECIMAL(10,2),

    CONSTRAINT "RehabInsurancePayer_pkey" PRIMARY KEY ("rehabId","insurancePayerId")
);

-- CreateTable
CREATE TABLE "PaymentOption" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "PaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabPaymentOption" (
    "rehabId" TEXT NOT NULL,
    "paymentOptionId" TEXT NOT NULL,

    CONSTRAINT "RehabPaymentOption_pkey" PRIMARY KEY ("rehabId","paymentOptionId")
);

-- CreateTable
CREATE TABLE "LevelOfCare" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "LevelOfCare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabLevelOfCare" (
    "rehabId" TEXT NOT NULL,
    "levelOfCareId" TEXT NOT NULL,

    CONSTRAINT "RehabLevelOfCare_pkey" PRIMARY KEY ("rehabId","levelOfCareId")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "kind" "ServiceKind" NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabService" (
    "rehabId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "RehabService_pkey" PRIMARY KEY ("rehabId","serviceId")
);

-- CreateTable
CREATE TABLE "DetoxService" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "substance" TEXT NOT NULL,

    CONSTRAINT "DetoxService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabDetoxService" (
    "rehabId" TEXT NOT NULL,
    "detoxServiceId" TEXT NOT NULL,

    CONSTRAINT "RehabDetoxService_pkey" PRIMARY KEY ("rehabId","detoxServiceId")
);

-- CreateTable
CREATE TABLE "Population" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" "PopulationCategory" NOT NULL,

    CONSTRAINT "Population_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabPopulation" (
    "rehabId" TEXT NOT NULL,
    "populationId" TEXT NOT NULL,

    CONSTRAINT "RehabPopulation_pkey" PRIMARY KEY ("rehabId","populationId")
);

-- CreateTable
CREATE TABLE "Accreditation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "acronym" TEXT,
    "url" TEXT,

    CONSTRAINT "Accreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabAccreditation" (
    "rehabId" TEXT NOT NULL,
    "accreditationId" TEXT NOT NULL,

    CONSTRAINT "RehabAccreditation_pkey" PRIMARY KEY ("rehabId","accreditationId")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabLanguage" (
    "rehabId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "RehabLanguage_pkey" PRIMARY KEY ("rehabId","languageId")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" "AmenityCategory" NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabAmenity" (
    "rehabId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "RehabAmenity_pkey" PRIMARY KEY ("rehabId","amenityId")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabEnvironment" (
    "rehabId" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,

    CONSTRAINT "RehabEnvironment_pkey" PRIMARY KEY ("rehabId","environmentId")
);

-- CreateTable
CREATE TABLE "SettingStyle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "SettingStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabSettingStyle" (
    "rehabId" TEXT NOT NULL,
    "settingStyleId" TEXT NOT NULL,

    CONSTRAINT "RehabSettingStyle_pkey" PRIMARY KEY ("rehabId","settingStyleId")
);

-- CreateTable
CREATE TABLE "LuxuryTier" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "LuxuryTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabLuxuryTier" (
    "rehabId" TEXT NOT NULL,
    "luxuryTierId" TEXT NOT NULL,

    CONSTRAINT "RehabLuxuryTier_pkey" PRIMARY KEY ("rehabId","luxuryTierId")
);

-- CreateTable
CREATE TABLE "ProgramFeature" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" "ProgramFeatureCategory" NOT NULL,

    CONSTRAINT "ProgramFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RehabProgramFeature" (
    "rehabId" TEXT NOT NULL,
    "programFeatureId" TEXT NOT NULL,

    CONSTRAINT "RehabProgramFeature_pkey" PRIMARY KEY ("rehabId","programFeatureId")
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
CREATE UNIQUE INDEX "Rehab_npi_number_key" ON "Rehab"("npi_number");

-- CreateIndex
CREATE UNIQUE INDEX "Rehab_slug_key" ON "Rehab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePayer_slug_key" ON "InsurancePayer"("slug");

-- CreateIndex
CREATE INDEX "RehabInsurancePayer_insurancePayerId_idx" ON "RehabInsurancePayer"("insurancePayerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOption_slug_key" ON "PaymentOption"("slug");

-- CreateIndex
CREATE INDEX "RehabPaymentOption_paymentOptionId_idx" ON "RehabPaymentOption"("paymentOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "LevelOfCare_slug_key" ON "LevelOfCare"("slug");

-- CreateIndex
CREATE INDEX "RehabLevelOfCare_levelOfCareId_idx" ON "RehabLevelOfCare"("levelOfCareId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "RehabService_serviceId_idx" ON "RehabService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "DetoxService_slug_key" ON "DetoxService"("slug");

-- CreateIndex
CREATE INDEX "RehabDetoxService_detoxServiceId_idx" ON "RehabDetoxService"("detoxServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Population_slug_key" ON "Population"("slug");

-- CreateIndex
CREATE INDEX "RehabPopulation_populationId_idx" ON "RehabPopulation"("populationId");

-- CreateIndex
CREATE UNIQUE INDEX "Accreditation_slug_key" ON "Accreditation"("slug");

-- CreateIndex
CREATE INDEX "RehabAccreditation_accreditationId_idx" ON "RehabAccreditation"("accreditationId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "RehabLanguage_languageId_idx" ON "RehabLanguage"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_slug_key" ON "Amenity"("slug");

-- CreateIndex
CREATE INDEX "RehabAmenity_amenityId_idx" ON "RehabAmenity"("amenityId");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_slug_key" ON "Environment"("slug");

-- CreateIndex
CREATE INDEX "RehabEnvironment_environmentId_idx" ON "RehabEnvironment"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "SettingStyle_slug_key" ON "SettingStyle"("slug");

-- CreateIndex
CREATE INDEX "RehabSettingStyle_settingStyleId_idx" ON "RehabSettingStyle"("settingStyleId");

-- CreateIndex
CREATE UNIQUE INDEX "LuxuryTier_slug_key" ON "LuxuryTier"("slug");

-- CreateIndex
CREATE INDEX "RehabLuxuryTier_luxuryTierId_idx" ON "RehabLuxuryTier"("luxuryTierId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramFeature_slug_key" ON "ProgramFeature"("slug");

-- CreateIndex
CREATE INDEX "RehabProgramFeature_programFeatureId_idx" ON "RehabProgramFeature"("programFeatureId");

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabInsurancePayer" ADD CONSTRAINT "RehabInsurancePayer_insurancePayerId_fkey" FOREIGN KEY ("insurancePayerId") REFERENCES "InsurancePayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPaymentOption" ADD CONSTRAINT "RehabPaymentOption_paymentOptionId_fkey" FOREIGN KEY ("paymentOptionId") REFERENCES "PaymentOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLevelOfCare" ADD CONSTRAINT "RehabLevelOfCare_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLevelOfCare" ADD CONSTRAINT "RehabLevelOfCare_levelOfCareId_fkey" FOREIGN KEY ("levelOfCareId") REFERENCES "LevelOfCare"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabService" ADD CONSTRAINT "RehabService_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabService" ADD CONSTRAINT "RehabService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabDetoxService" ADD CONSTRAINT "RehabDetoxService_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabDetoxService" ADD CONSTRAINT "RehabDetoxService_detoxServiceId_fkey" FOREIGN KEY ("detoxServiceId") REFERENCES "DetoxService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPopulation" ADD CONSTRAINT "RehabPopulation_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabPopulation" ADD CONSTRAINT "RehabPopulation_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "Population"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAccreditation" ADD CONSTRAINT "RehabAccreditation_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAccreditation" ADD CONSTRAINT "RehabAccreditation_accreditationId_fkey" FOREIGN KEY ("accreditationId") REFERENCES "Accreditation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLanguage" ADD CONSTRAINT "RehabLanguage_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLanguage" ADD CONSTRAINT "RehabLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAmenity" ADD CONSTRAINT "RehabAmenity_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabAmenity" ADD CONSTRAINT "RehabAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabEnvironment" ADD CONSTRAINT "RehabEnvironment_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabEnvironment" ADD CONSTRAINT "RehabEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabSettingStyle" ADD CONSTRAINT "RehabSettingStyle_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabSettingStyle" ADD CONSTRAINT "RehabSettingStyle_settingStyleId_fkey" FOREIGN KEY ("settingStyleId") REFERENCES "SettingStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLuxuryTier" ADD CONSTRAINT "RehabLuxuryTier_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabLuxuryTier" ADD CONSTRAINT "RehabLuxuryTier_luxuryTierId_fkey" FOREIGN KEY ("luxuryTierId") REFERENCES "LuxuryTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeature" ADD CONSTRAINT "RehabProgramFeature_rehabId_fkey" FOREIGN KEY ("rehabId") REFERENCES "Rehab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RehabProgramFeature" ADD CONSTRAINT "RehabProgramFeature_programFeatureId_fkey" FOREIGN KEY ("programFeatureId") REFERENCES "ProgramFeature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
