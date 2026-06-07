-- CreateTable
CREATE TABLE "custody_days" (
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custody_days_pkey" PRIMARY KEY ("date")
);
