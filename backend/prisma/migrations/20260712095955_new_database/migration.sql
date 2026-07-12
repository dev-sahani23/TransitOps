/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `drivers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "drivers" ADD COLUMN "dateOfBirth" DATETIME;
ALTER TABLE "drivers" ADD COLUMN "email" TEXT;
ALTER TABLE "drivers" ADD COLUMN "joiningDate" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "drivers_email_key" ON "drivers"("email");
