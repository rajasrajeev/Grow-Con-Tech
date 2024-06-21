/*
  Warnings:

  - Added the required column `stateId` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "stateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
