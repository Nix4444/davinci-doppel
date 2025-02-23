-- CreateEnum
CREATE TYPE "ModelTrainingEnumStatus" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "trainingStatus" "ModelTrainingEnumStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWord" TEXT;
