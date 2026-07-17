-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('IDR', 'SAR', 'USD');

-- AlterTable
ALTER TABLE "AdditionalService" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';

-- AlterTable
ALTER TABLE "DocumentCost" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';

-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';

-- AlterTable
ALTER TABLE "GuideFee" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "usdRate" DOUBLE PRECISION NOT NULL DEFAULT 15800;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'SAR';
