/*
  Warnings:

  - You are about to drop the `ComplianceStandard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Control` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GapAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Control" DROP CONSTRAINT "Control_standardId_fkey";

-- DropForeignKey
ALTER TABLE "GapAnalysis" DROP CONSTRAINT "GapAnalysis_controlId_fkey";

-- DropForeignKey
ALTER TABLE "GapAnalysis" DROP CONSTRAINT "GapAnalysis_evidenceId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_gapAnalysisId_fkey";

-- DropTable
DROP TABLE "ComplianceStandard";

-- DropTable
DROP TABLE "Control";

-- DropTable
DROP TABLE "Evidence";

-- DropTable
DROP TABLE "GapAnalysis";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_reports" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_standards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controls" (
    "id" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidences" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "resourceId" TEXT,
    "checkName" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gap_analyses" (
    "id" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gap_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigneeId" TEXT,
    "gapAnalysisId" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_standards_name_key" ON "compliance_standards"("name");

-- AddForeignKey
ALTER TABLE "scan_reports" ADD CONSTRAINT "scan_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controls" ADD CONSTRAINT "controls_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "compliance_standards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gap_analyses" ADD CONSTRAINT "gap_analyses_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gap_analyses" ADD CONSTRAINT "gap_analyses_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "evidences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_gapAnalysisId_fkey" FOREIGN KEY ("gapAnalysisId") REFERENCES "gap_analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
