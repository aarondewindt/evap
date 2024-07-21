-- CreateEnum
CREATE TYPE "BigCalendarView" AS ENUM ('month', 'week', 'work_week', 'day', 'agenda');

-- AlterTable
ALTER TABLE "GlobalVolunteerSetting" ADD COLUMN     "default_calendar_date" TIMESTAMP(3),
ADD COLUMN     "default_calendar_view" "BigCalendarView";
