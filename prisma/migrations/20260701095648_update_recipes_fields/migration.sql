/*
  Warnings:

  - You are about to drop the column `is_public` on the `recipe` table. All the data in the column will be lost.
  - The `ingredients` column on the `recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `steps` column on the `recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `servings` to the `recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecipeCategory" AS ENUM ('ITALIAN', 'ASIAN', 'DESSERT', 'VEGETARIAN', 'VEGAN', 'OTHER');

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "is_public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "servings" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
DROP COLUMN "category",
ADD COLUMN     "category" "RecipeCategory" NOT NULL,
DROP COLUMN "ingredients",
ADD COLUMN     "ingredients" TEXT[],
DROP COLUMN "steps",
ADD COLUMN     "steps" TEXT[];
