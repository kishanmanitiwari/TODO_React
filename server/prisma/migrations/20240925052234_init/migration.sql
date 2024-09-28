-- CreateTable
CREATE TABLE "Users" (
    "u_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "t_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "u_id" INTEGER NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("t_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "Users"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;
