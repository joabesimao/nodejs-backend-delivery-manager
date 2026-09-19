-- AlterTable
ALTER TABLE `Account` ADD COLUMN `refreshTokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `refreshTokenHash` VARCHAR(64) NULL,
    MODIFY `role` ENUM('admin', 'gerente_estoque', 'entregador', 'user') NOT NULL DEFAULT 'user';
