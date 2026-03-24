-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_team_uuid_fkey" FOREIGN KEY ("team_uuid") REFERENCES "teams"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_uuid_fkey" FOREIGN KEY ("account_uuid") REFERENCES "accounts"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
