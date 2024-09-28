-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_t_id_fkey";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "Users"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;
