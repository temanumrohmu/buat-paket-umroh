-- AlterTable
ALTER TABLE "DocumentCost" ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "presetKey" TEXT;
