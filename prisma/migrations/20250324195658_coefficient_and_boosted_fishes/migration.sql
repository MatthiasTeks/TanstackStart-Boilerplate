-- AlterTable
ALTER TABLE "Fish" ADD COLUMN     "boosted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FishType" ADD COLUMN     "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0;
