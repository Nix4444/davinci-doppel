/*
  Warnings:

  - Added the required column `prompt` to the `GeneratedImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GeneratedImagesStatus" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "GeneratedImages" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "GeneratedImagesStatus" NOT NULL DEFAULT 'Pending';
