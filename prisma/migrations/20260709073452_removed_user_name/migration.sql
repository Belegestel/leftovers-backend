/*
  Warnings:

  - You are about to drop the column `name` on the `signup_requests` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "signup_requests" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";
