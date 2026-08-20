/*
  Warnings:

  - You are about to drop the column `availability` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "availability",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
