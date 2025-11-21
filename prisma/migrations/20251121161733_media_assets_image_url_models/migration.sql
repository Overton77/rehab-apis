-- CreateEnum
CREATE TYPE "MediaOwnerType" AS ENUM ('REHAB_ORG', 'REHAB_CAMPUS', 'REHAB_PROGRAM', 'INSURANCE_PAYER', 'PARENT_COMPANY', 'USER');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "InsurancePayer" ADD COLUMN     "logoImageUrl" TEXT;

-- AlterTable
ALTER TABLE "ParentCompany" ADD COLUMN     "galleryImageUrls" TEXT[],
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "RehabCampus" ADD COLUMN     "galleryImageUrls" TEXT[],
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "RehabOrg" ADD COLUMN     "galleryImageUrls" TEXT[],
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "RehabProgram" ADD COLUMN     "galleryImageUrls" TEXT[],
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImageUrl" TEXT;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "ownerType" "MediaOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "role" TEXT,
    "bucketKey" TEXT NOT NULL,
    "cdnUrl" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_ownerType_ownerId_idx" ON "MediaAsset"("ownerType", "ownerId");
