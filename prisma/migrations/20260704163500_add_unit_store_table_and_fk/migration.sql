-- CreateTable
CREATE TABLE `UnitStore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `OrderDelivery`
    ADD COLUMN `unitStoreId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `OrderDelivery_unitStoreId_idx` ON `OrderDelivery`(`unitStoreId`);

-- AddForeignKey
ALTER TABLE `OrderDelivery`
    ADD CONSTRAINT `OrderDelivery_unitStoreId_fkey`
    FOREIGN KEY (`unitStoreId`) REFERENCES `UnitStore`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
