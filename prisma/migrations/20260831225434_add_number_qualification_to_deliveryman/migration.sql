/*
  Warnings:

  - Added the required column `numberQualification` to the `Deliveryman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Deliveryman` ADD COLUMN `numberQualification` VARCHAR(191) NOT NULL;
