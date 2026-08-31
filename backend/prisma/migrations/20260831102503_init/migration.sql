/*
  Warnings:

  - You are about to drop the column `type` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleName` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `category` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN "cargo" TEXT;
ALTER TABLE "trips" ADD COLUMN "revenue" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "tripId" TEXT,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "expenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expenses_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_expenses" ("amount", "date", "id", "vehicleId") SELECT "amount", "date", "id", "vehicleId" FROM "expenses";
DROP TABLE "expenses";
ALTER TABLE "new_expenses" RENAME TO "expenses";
CREATE TABLE "new_maintenance_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'scheduled',
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "odometer" REAL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    CONSTRAINT "maintenance_logs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_maintenance_logs" ("cost", "description", "endDate", "id", "startDate", "status", "vehicleId") SELECT "cost", "description", "endDate", "id", "startDate", "status", "vehicleId" FROM "maintenance_logs";
DROP TABLE "maintenance_logs";
ALTER TABLE "new_maintenance_logs" RENAME TO "maintenance_logs";
CREATE TABLE "new_vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registrationNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "maximumCapacity" REAL NOT NULL,
    "odometer" REAL NOT NULL DEFAULT 0,
    "acquisitionCost" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_vehicles" ("acquisitionCost", "createdAt", "id", "maximumCapacity", "odometer", "registrationNumber", "status", "updatedAt", "vehicleType") SELECT "acquisitionCost", "createdAt", "id", "maximumCapacity", "odometer", "registrationNumber", "status", "updatedAt", "vehicleType" FROM "vehicles";
DROP TABLE "vehicles";
ALTER TABLE "new_vehicles" RENAME TO "vehicles";
CREATE UNIQUE INDEX "vehicles_registrationNumber_key" ON "vehicles"("registrationNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
