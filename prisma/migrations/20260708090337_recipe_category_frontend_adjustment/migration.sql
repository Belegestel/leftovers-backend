/*
  Warnings:

  - The values [ITALIAN,ASIAN,DESSERT,VEGETARIAN,VEGAN,OTHER] on the enum `RecipeCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecipeCategory_new" AS ENUM ('BREAKFAST', 'SOUPS', 'LUNCH', 'BAKING', 'DESSERTS', 'DRINKS', 'SNACKS', 'SALADS');
ALTER TABLE "recipe" ALTER COLUMN "category" TYPE "RecipeCategory_new" USING ("category"::text::"RecipeCategory_new");
ALTER TYPE "RecipeCategory" RENAME TO "RecipeCategory_old";
ALTER TYPE "RecipeCategory_new" RENAME TO "RecipeCategory";
DROP TYPE "public"."RecipeCategory_old";
COMMIT;
