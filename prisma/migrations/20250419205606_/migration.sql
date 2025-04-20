/*
  Warnings:

  - You are about to drop the column `imageId` on the `Blog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_imageId_fkey";

-- DropIndex
DROP INDEX "Blog_imageId_key";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "imageId";
