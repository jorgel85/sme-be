/*
  Warnings:

  - You are about to drop the column `verificationLink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verificationLinkExp` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_verificationLink_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationLink",
DROP COLUMN "verificationLinkExp",
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetPasswordTokenExp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");
