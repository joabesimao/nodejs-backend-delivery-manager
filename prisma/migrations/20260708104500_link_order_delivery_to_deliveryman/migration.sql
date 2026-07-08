-- AlterTable
ALTER TABLE `OrderDelivery`
    ADD COLUMN `deliverymanId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `OrderDelivery_deliverymanId_idx` ON `OrderDelivery`(`deliverymanId`);

-- AddForeignKey
ALTER TABLE `OrderDelivery`
    ADD CONSTRAINT `OrderDelivery_deliverymanId_fkey`
    FOREIGN KEY (`deliverymanId`) REFERENCES `Deliveryman`(`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
