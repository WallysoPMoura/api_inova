/*
  Warnings:

  - Made the column `thumbnail` on table `campaigns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `campaigns` MODIFY `thumbnail` VARCHAR(191) NOT NULL;
