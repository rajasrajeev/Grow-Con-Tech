/*
  Warnings:

  - Added the required column `status` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Approved', 'Pending', 'Rejected');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "status" "AccountStatus" NOT NULL;
