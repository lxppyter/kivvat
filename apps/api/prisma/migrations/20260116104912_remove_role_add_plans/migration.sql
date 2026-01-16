/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DEFAULT 'COMPLIANCE CORE';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";
