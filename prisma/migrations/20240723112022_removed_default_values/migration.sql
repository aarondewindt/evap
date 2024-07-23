-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventActivity" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventTask" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "GlobalVolunteerSettingsDeadlineException" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "VolunteerAvailabilitySlot" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "VolunteerEventTask" ALTER COLUMN "updated_at" DROP DEFAULT;
