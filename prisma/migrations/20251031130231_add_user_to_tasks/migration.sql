/*
  Warnings:

  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the column as nullable
ALTER TABLE "Task" ADD COLUMN "userId" TEXT;

-- Create a default user for existing tasks (or delete existing tasks)
-- Option 1: Delete all existing tasks
DELETE FROM "Task";

-- Option 2: Or assign to first user (uncomment if you want to keep tasks)
-- UPDATE "Task" SET "userId" = (SELECT "id" FROM "User" LIMIT 1) WHERE "userId" IS NULL;

-- Now make the column required
ALTER TABLE "Task" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
