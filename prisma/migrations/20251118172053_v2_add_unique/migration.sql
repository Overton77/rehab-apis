/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Accreditation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `CampusStory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `DetoxService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Environment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyName]` on the table `InsurancePayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `InsurancePayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `LuxuryTier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `MATType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `OrgStory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ParentCompany` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `PaymentOption` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Population` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `ProgramFeature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `ProgramStory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `RehabOrg` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `RehabProgram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `SettingStyle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `SocialMediaProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `Substance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `YoutubeVideo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyName` to the `InsurancePayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InsurancePayer" ADD COLUMN     "companyName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Accreditation_displayName_key" ON "Accreditation"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_displayName_key" ON "Amenity"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "CampusStory_title_key" ON "CampusStory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "DetoxService_displayName_key" ON "DetoxService"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_displayName_key" ON "Environment"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePayer_companyName_key" ON "InsurancePayer"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePayer_displayName_key" ON "InsurancePayer"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Language_displayName_key" ON "Language"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "LuxuryTier_displayName_key" ON "LuxuryTier"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "MATType_displayName_key" ON "MATType"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "OrgStory_title_key" ON "OrgStory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ParentCompany_name_key" ON "ParentCompany"("name");

-- CreateIndex
CREATE INDEX "ParentCompany_name_idx" ON "ParentCompany"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOption_displayName_key" ON "PaymentOption"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Population_displayName_key" ON "Population"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramFeature_displayName_key" ON "ProgramFeature"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramStory_title_key" ON "ProgramStory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "RehabOrg_name_key" ON "RehabOrg"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RehabProgram_name_key" ON "RehabProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_displayName_key" ON "Service"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "SettingStyle_displayName_key" ON "SettingStyle"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaProfile_url_key" ON "SocialMediaProfile"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_displayName_key" ON "Substance"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeVideo_url_key" ON "YoutubeVideo"("url");
