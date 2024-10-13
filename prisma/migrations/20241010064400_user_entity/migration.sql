-- DropIndex
DROP INDEX "users_email_phoneNumber_verificationCode_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationCodeExp" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "users_email_phoneNumber_idx" ON "users"("email", "phoneNumber");
