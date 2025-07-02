/*
  Warnings:

  - Added the required column `postTitle` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "postTitle" TEXT NOT NULL;
