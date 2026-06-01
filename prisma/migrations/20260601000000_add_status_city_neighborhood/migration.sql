-- AlterTable
ALTER TABLE `OrderDelivery` ADD COLUMN `status` ENUM('actived', 'delivered', 'finished') NOT NULL DEFAULT 'actived';

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Neighborhood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Neighborhood` ADD CONSTRAINT `Neighborhood_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
