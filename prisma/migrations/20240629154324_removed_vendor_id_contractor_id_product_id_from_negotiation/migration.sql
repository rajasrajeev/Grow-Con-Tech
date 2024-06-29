/*
  Warnings:

  - You are about to drop the column `contractorId` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Negotiation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_contractorId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_productId_fkey";

-- DropForeignKey
ALTER TABLE "Negotiation" DROP CONSTRAINT "Negotiation_vendorId_fkey";

-- AlterTable
ALTER TABLE "Negotiation" DROP COLUMN "contractorId",
DROP COLUMN "productId",
DROP COLUMN "vendorId";
