/*
  Warnings:

  - You are about to drop the column `event_id` on the `VolunteerAvailabilitySlot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VolunteerAvailabilitySlot" DROP CONSTRAINT "VolunteerAvailabilitySlot_event_id_fkey";

-- AlterTable
ALTER TABLE "VolunteerAvailabilitySlot" DROP COLUMN "event_id";
