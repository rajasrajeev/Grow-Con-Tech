/*
  Warnings:

  - You are about to drop the column `status` on the `Negotiation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Negotiation" DROP COLUMN "status",
ADD COLUMN     "status_from_contractor" "NegotiationStatus" NOT NULL DEFAULT 'REPLIED',
ADD COLUMN     "status_from_vendor" "NegotiationStatus" NOT NULL DEFAULT 'PENDING';
