-- AlterTable
ALTER TABLE `Account` ADD COLUMN `previousRefreshTokenHash` VARCHAR(64) NULL,
    ADD COLUMN `refreshTokenRotatedAt` DATETIME(3) NULL;
