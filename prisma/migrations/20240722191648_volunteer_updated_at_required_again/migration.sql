/*
  Warnings:

  - Made the column `updated_at` on table `Volunteer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Volunteer" ALTER COLUMN "updated_at" SET NOT NULL;
