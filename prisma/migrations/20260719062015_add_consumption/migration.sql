-- CreateTable
CREATE TABLE "Consumption" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "presetKey" TEXT,
    "label" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'SAR',
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'TOTAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
