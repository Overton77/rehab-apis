-- CreateEnum
CREATE TYPE "InsuranceEligibilityStatus" AS ENUM ('PENDING', 'VERIFIED', 'DENIED', 'ERROR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PreAssessmentQuestionInputType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'SINGLE_SELECT', 'MULTI_SELECT', 'DATE', 'DATETIME', 'SCALE_1_10');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LOVED_ONE', 'USER', 'ADMIN', 'MASTER');

-- DropForeignKey
ALTER TABLE "RehabInsurancePayer" DROP CONSTRAINT "RehabInsurancePayer_campusId_fkey";

-- DropForeignKey
ALTER TABLE "RehabInsurancePayer" DROP CONSTRAINT "RehabInsurancePayer_programId_fkey";

-- DropForeignKey
ALTER TABLE "RehabPaymentOption" DROP CONSTRAINT "RehabPaymentOption_campusId_fkey";

-- DropForeignKey
ALTER TABLE "RehabPaymentOption" DROP CONSTRAINT "RehabPaymentOption_programId_fkey";

-- CreateTable
CREATE TABLE "PreAssessmentForm" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreAssessmentForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreAssessmentFormQuestion" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "inputType" "PreAssessmentQuestionInputType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "options" JSONB,
    "visibilityLogic" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreAssessmentFormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "full_priveleges" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreAssessmentSubmission" (
    "id" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "preAssessmentFormId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreAssessmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreAssessmentAnswer" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreAssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInsuranceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insurancePayerId" TEXT NOT NULL,
    "rehabOrgId" TEXT,
    "rehabCampusId" TEXT,
    "rehabProgramId" TEXT,
    "memberId" TEXT NOT NULL,
    "groupNumber" TEXT,
    "planName" TEXT,
    "cardHash" TEXT,
    "eligibilityStatus" "InsuranceEligibilityStatus" NOT NULL DEFAULT 'PENDING',
    "eligibilityCheckedAt" TIMESTAMP(3),
    "eligibilityReferenceId" TEXT,
    "eligibilityNotes" TEXT,
    "frontImageKey" TEXT,
    "backImageKey" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pVerifyApprovalRun" JSONB,

    CONSTRAINT "UserInsuranceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "preferredContactMethod" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "genderIdentity" TEXT,
    "pronouns" TEXT,
    "primaryConcern" TEXT,
    "hasCoOccurringDisorders" BOOLEAN,
    "priorTreatmentHistory" TEXT,
    "latestPreAssessmentSubmissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSavedRehabOrg" (
    "userId" TEXT NOT NULL,
    "rehabOrgId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "UserSavedRehabOrg_pkey" PRIMARY KEY ("userId","rehabOrgId")
);

-- CreateTable
CREATE TABLE "UserSavedRehabCampus" (
    "userId" TEXT NOT NULL,
    "rehabCampusId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "UserSavedRehabCampus_pkey" PRIMARY KEY ("userId","rehabCampusId")
);

-- CreateTable
CREATE TABLE "UserSavedRehabProgram" (
    "userId" TEXT NOT NULL,
    "rehabProgramId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "UserSavedRehabProgram_pkey" PRIMARY KEY ("userId","rehabProgramId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreAssessmentForm_slug_key" ON "PreAssessmentForm"("slug");

-- CreateIndex
CREATE INDEX "PreAssessmentFormQuestion_formId_idx" ON "PreAssessmentFormQuestion"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "PreAssessmentFormQuestion_formId_questionKey_key" ON "PreAssessmentFormQuestion"("formId", "questionKey");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "UserPreAssessmentSubmission_userProfileId_idx" ON "UserPreAssessmentSubmission"("userProfileId");

-- CreateIndex
CREATE INDEX "UserPreAssessmentSubmission_preAssessmentFormId_idx" ON "UserPreAssessmentSubmission"("preAssessmentFormId");

-- CreateIndex
CREATE INDEX "UserPreAssessmentAnswer_submissionId_idx" ON "UserPreAssessmentAnswer"("submissionId");

-- CreateIndex
CREATE INDEX "UserPreAssessmentAnswer_questionId_idx" ON "UserPreAssessmentAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreAssessmentAnswer_submissionId_questionId_key" ON "UserPreAssessmentAnswer"("submissionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserInsuranceProfile_userId_idx" ON "UserInsuranceProfile"("userId");

-- CreateIndex
CREATE INDEX "UserInsuranceProfile_insurancePayerId_idx" ON "UserInsuranceProfile"("insurancePayerId");

-- CreateIndex
CREATE INDEX "UserInsuranceProfile_rehabOrgId_idx" ON "UserInsuranceProfile"("rehabOrgId");

-- CreateIndex
CREATE INDEX "UserInsuranceProfile_userId_isActive_isPrimary_idx" ON "UserInsuranceProfile"("userId", "isActive", "isPrimary");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_refreshTokenHash_idx" ON "UserSession"("refreshTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_latestPreAssessmentSubmissionId_key" ON "UserProfile"("latestPreAssessmentSubmissionId");

-- CreateIndex
CREATE INDEX "UserSavedRehabOrg_rehabOrgId_idx" ON "UserSavedRehabOrg"("rehabOrgId");

-- CreateIndex
CREATE INDEX "UserSavedRehabCampus_rehabCampusId_idx" ON "UserSavedRehabCampus"("rehabCampusId");

-- CreateIndex
CREATE INDEX "UserSavedRehabProgram_rehabProgramId_idx" ON "UserSavedRehabProgram"("rehabProgramId");

-- AddForeignKey
ALTER TABLE "PreAssessmentFormQuestion" ADD CONSTRAINT "PreAssessmentFormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "PreAssessmentForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreAssessmentSubmission" ADD CONSTRAINT "UserPreAssessmentSubmission_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreAssessmentSubmission" ADD CONSTRAINT "UserPreAssessmentSubmission_preAssessmentFormId_fkey" FOREIGN KEY ("preAssessmentFormId") REFERENCES "PreAssessmentForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreAssessmentAnswer" ADD CONSTRAINT "UserPreAssessmentAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "UserPreAssessmentSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreAssessmentAnswer" ADD CONSTRAINT "UserPreAssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PreAssessmentFormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsuranceProfile" ADD CONSTRAINT "UserInsuranceProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsuranceProfile" ADD CONSTRAINT "UserInsuranceProfile_insurancePayerId_fkey" FOREIGN KEY ("insurancePayerId") REFERENCES "InsurancePayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsuranceProfile" ADD CONSTRAINT "UserInsuranceProfile_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_latestPreAssessmentSubmissionId_fkey" FOREIGN KEY ("latestPreAssessmentSubmissionId") REFERENCES "UserPreAssessmentSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabOrg" ADD CONSTRAINT "UserSavedRehabOrg_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabOrg" ADD CONSTRAINT "UserSavedRehabOrg_rehabOrgId_fkey" FOREIGN KEY ("rehabOrgId") REFERENCES "RehabOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabCampus" ADD CONSTRAINT "UserSavedRehabCampus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabCampus" ADD CONSTRAINT "UserSavedRehabCampus_rehabCampusId_fkey" FOREIGN KEY ("rehabCampusId") REFERENCES "RehabCampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabProgram" ADD CONSTRAINT "UserSavedRehabProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRehabProgram" ADD CONSTRAINT "UserSavedRehabProgram_rehabProgramId_fkey" FOREIGN KEY ("rehabProgramId") REFERENCES "RehabProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
