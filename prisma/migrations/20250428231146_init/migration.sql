-- AlterTable
ALTER TABLE `register` ADD COLUMN `orderDeliveryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `OrderDelivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registerId` INTEGER NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrderDelivery_registerId_key`(`registerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderDelivery` ADD CONSTRAINT `OrderDelivery_registerId_fkey` FOREIGN KEY (`registerId`) REFERENCES `Register`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
