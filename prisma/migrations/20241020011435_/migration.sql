/*
  Warnings:

  - Made the column `title` on table `ideas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ideas` MODIFY `title` VARCHAR(191) NOT NULL;
