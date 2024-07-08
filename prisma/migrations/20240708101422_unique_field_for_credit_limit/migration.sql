/*
  Warnings:

  - A unique constraint covering the columns `[contractor_id,vendor_id]` on the table `Credit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credit_contractor_id_vendor_id_key" ON "Credit"("contractor_id", "vendor_id");
