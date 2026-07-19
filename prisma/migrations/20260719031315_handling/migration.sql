-- CreateTable
CREATE TABLE "Handling" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'LAINNYA',
    "presetKey" TEXT,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'SAR',
    "pricingMode" "PricingMode" NOT NULL DEFAULT 'TOTAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Handling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Handling" ADD CONSTRAINT "Handling_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
