-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "votingWins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "fishId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votingDay" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotingResult" (
    "id" SERIAL NOT NULL,
    "fishId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "votingDay" DATE NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotingResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_ipAddress_votingDay_key" ON "Vote"("ipAddress", "votingDay");

-- CreateIndex
CREATE UNIQUE INDEX "VotingResult_votingDay_key" ON "VotingResult"("votingDay");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_fishId_fkey" FOREIGN KEY ("fishId") REFERENCES "Fish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
