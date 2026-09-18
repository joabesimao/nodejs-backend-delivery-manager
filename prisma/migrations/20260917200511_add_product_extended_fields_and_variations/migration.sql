-- AlterTable
ALTER TABLE `Product` ADD COLUMN `barcode` VARCHAR(191) NULL,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `imageBase64` LONGTEXT NULL,
    ADD COLUMN `imageMimeType` VARCHAR(191) NULL,
    ADD COLUMN `model` VARCHAR(191) NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `subcategory` VARCHAR(191) NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProductVariation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,

    INDEX `ProductVariation_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Product_barcode_key` ON `Product`(`barcode`);

-- AddForeignKey
ALTER TABLE `ProductVariation` ADD CONSTRAINT `ProductVariation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
