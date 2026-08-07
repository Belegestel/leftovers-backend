/*
  Warnings:

  - You are about to drop the column `description` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification` table. All the data in the column will be lost.
  - Added the required column `data` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RECIPE_EDIT');

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;
