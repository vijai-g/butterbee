-- CreateEnum
CREATE TYPE "Department" AS ENUM ('FOOD', 'CLOTHES', 'SPORTS');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "department" "Department" NOT NULL DEFAULT 'FOOD';
