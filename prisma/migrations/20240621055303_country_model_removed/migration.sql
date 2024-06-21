/*
  Warnings:

  - You are about to drop the column `countryId` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `State` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `districtId` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_stateId_fkey";

-- AlterTable
ALTER TABLE "State" DROP COLUMN "countryId";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "stateId",
ADD COLUMN     "districtId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Country";

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
