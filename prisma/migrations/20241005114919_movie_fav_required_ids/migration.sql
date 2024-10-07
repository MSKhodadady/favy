/*
  Warnings:

  - Made the column `Movie_id` on table `MovieFav` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `MovieFav` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MovieFav" ALTER COLUMN "Movie_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;
