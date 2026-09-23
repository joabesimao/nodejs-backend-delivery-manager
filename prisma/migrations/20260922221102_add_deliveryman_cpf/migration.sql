-- AlterTable
ALTER TABLE `Deliveryman` ADD COLUMN `cpf` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Deliveryman_cpf_key` ON `Deliveryman`(`cpf`);
