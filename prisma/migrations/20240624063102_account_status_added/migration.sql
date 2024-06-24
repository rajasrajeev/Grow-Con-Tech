/*
  Warnings:

  - Added the required column `status` to the `Contractor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contractor" ADD COLUMN     "status" "AccountStatus" NOT NULL;
