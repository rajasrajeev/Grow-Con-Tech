/*
  Warnings:

  - You are about to drop the column `user_id` on the `DailyRate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyRate" DROP CONSTRAINT "DailyRate_user_id_fkey";

-- AlterTable
ALTER TABLE "DailyRate" DROP COLUMN "user_id";
