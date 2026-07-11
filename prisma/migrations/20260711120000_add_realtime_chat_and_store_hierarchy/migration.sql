-- AlterTable
ALTER TABLE `Account`
    ADD COLUMN `role` ENUM('principal', 'branch') NOT NULL DEFAULT 'branch',
    ADD COLUMN `unitStoreId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UnitStore`
    ADD COLUMN `isMain` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `parentStoreId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitStoreId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `text` VARCHAR(191) NULL,
    `imageBase64` LONGTEXT NULL,
    `imageMimeType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Account_unitStoreId_idx` ON `Account`(`unitStoreId`);

-- CreateIndex
CREATE INDEX `UnitStore_parentStoreId_idx` ON `UnitStore`(`parentStoreId`);

-- CreateIndex
CREATE INDEX `ChatMessage_unitStoreId_createdAt_idx` ON `ChatMessage`(`unitStoreId`, `createdAt`);

-- AddForeignKey
ALTER TABLE `Account`
    ADD CONSTRAINT `Account_unitStoreId_fkey`
    FOREIGN KEY (`unitStoreId`) REFERENCES `UnitStore`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnitStore`
    ADD CONSTRAINT `UnitStore_parentStoreId_fkey`
    FOREIGN KEY (`parentStoreId`) REFERENCES `UnitStore`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage`
    ADD CONSTRAINT `ChatMessage_unitStoreId_fkey`
    FOREIGN KEY (`unitStoreId`) REFERENCES `UnitStore`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage`
    ADD CONSTRAINT `ChatMessage_senderId_fkey`
    FOREIGN KEY (`senderId`) REFERENCES `Account`(`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
