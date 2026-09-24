-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plate` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `deliverymanId` INTEGER NULL,

    UNIQUE INDEX `Vehicle_plate_key`(`plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OilChangeConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `intervalKm` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OilChangeLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `deliverymanId` INTEGER NOT NULL,
    `km` INTEGER NOT NULL,
    `nextChangeKm` INTEGER NOT NULL,
    `changeDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OilChangeLog_vehicleId_changeDate_idx`(`vehicleId`, `changeDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuelRefill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `deliverymanId` INTEGER NOT NULL,
    `km` INTEGER NOT NULL,
    `previousKm` INTEGER NULL,
    `kmDriven` INTEGER NULL,
    `liters` DECIMAL(10, 2) NOT NULL,
    `totalValue` DECIMAL(10, 2) NOT NULL,
    `refillDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FuelRefill_vehicleId_refillDate_idx`(`vehicleId`, `refillDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_deliverymanId_fkey` FOREIGN KEY (`deliverymanId`) REFERENCES `Deliveryman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OilChangeLog` ADD CONSTRAINT `OilChangeLog_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OilChangeLog` ADD CONSTRAINT `OilChangeLog_deliverymanId_fkey` FOREIGN KEY (`deliverymanId`) REFERENCES `Deliveryman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelRefill` ADD CONSTRAINT `FuelRefill_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelRefill` ADD CONSTRAINT `FuelRefill_deliverymanId_fkey` FOREIGN KEY (`deliverymanId`) REFERENCES `Deliveryman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
