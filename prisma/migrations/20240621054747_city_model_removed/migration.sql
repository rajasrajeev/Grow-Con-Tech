/*
  Warnings:

  - You are about to drop the column `cityId` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gst_no` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licence_no` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pan_no` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_stateId_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_cityId_fkey";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "cityId",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "gst_no" TEXT NOT NULL,
ADD COLUMN     "licence_no" TEXT NOT NULL,
ADD COLUMN     "pan_no" TEXT NOT NULL;

-- DropTable
DROP TABLE "City";
