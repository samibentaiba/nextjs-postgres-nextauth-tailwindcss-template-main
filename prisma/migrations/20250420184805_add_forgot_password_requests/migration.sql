-- CreateTable
CREATE TABLE "ForgotPasswordRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForgotPasswordRequest_pkey" PRIMARY KEY ("id")
);
