/*
  Warnings:

  - Added the required column `image_key` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "image_key" TEXT;
