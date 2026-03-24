-- CreateTable
CREATE TABLE "teams" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "accounts" (
    "uuid" TEXT NOT NULL,
    "team_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "transactions" (
    "uuid" TEXT NOT NULL,
    "account_uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("uuid")
);
