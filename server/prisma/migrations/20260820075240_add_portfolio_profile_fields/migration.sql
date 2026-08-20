-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "openToFreelance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openToFullTime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openToOpenSource" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "role" TEXT;
