-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "departureDate" TIMESTAMP(3),
ADD COLUMN     "nightsMadinah" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nightsMakkah" INTEGER NOT NULL DEFAULT 0;
