-- AlterTable
ALTER TABLE `OrderDelivery`
    ADD COLUMN `receivedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `finishedAt` DATETIME(3) NULL;

-- Backfill
UPDATE `OrderDelivery`
SET `receivedAt` = `data`
WHERE `receivedAt` IS NULL;

UPDATE `OrderDelivery`
SET `finishedAt` = `data`
WHERE `status` = 'finished' AND `finishedAt` IS NULL;
