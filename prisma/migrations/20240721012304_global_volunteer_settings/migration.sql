-- CreateTable
CREATE TABLE "GlobalVolunteerSetting" (
    "id" TEXT NOT NULL,
    "edit_deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalVolunteerSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalVolunteerSettingsDeadlineException" (
    "global_volunteer_setting_id" TEXT NOT NULL,
    "volunteer_id" TEXT NOT NULL,

    CONSTRAINT "GlobalVolunteerSettingsDeadlineException_pkey" PRIMARY KEY ("global_volunteer_setting_id","volunteer_id")
);

-- AddForeignKey
ALTER TABLE "GlobalVolunteerSettingsDeadlineException" ADD CONSTRAINT "GlobalVolunteerSettingsDeadlineException_global_volunteer__fkey" FOREIGN KEY ("global_volunteer_setting_id") REFERENCES "GlobalVolunteerSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalVolunteerSettingsDeadlineException" ADD CONSTRAINT "GlobalVolunteerSettingsDeadlineException_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
