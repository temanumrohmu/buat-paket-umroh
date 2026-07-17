-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'LAINNYA',
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "presetKey" TEXT,
ADD COLUMN     "vehicleType" TEXT NOT NULL DEFAULT '';
