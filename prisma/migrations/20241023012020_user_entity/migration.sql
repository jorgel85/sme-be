/*
  Warnings:

  - A unique constraint covering the columns `[verificationLink]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationLink" TEXT,
ADD COLUMN     "verificationLinkExp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationLink_key" ON "users"("verificationLink");
