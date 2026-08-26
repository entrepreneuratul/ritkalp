-- AlterTable
ALTER TABLE "BuilderExtraItem" DROP COLUMN "inStock",
ADD COLUMN     "inventoryfySku" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "inStock",
ADD COLUMN     "inventoryfySku" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Kit" DROP COLUMN "inStock",
ADD COLUMN     "inventoryfySku" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "inventoryfyOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BuilderExtraItem_inventoryfySku_key" ON "BuilderExtraItem"("inventoryfySku");

-- CreateIndex
CREATE UNIQUE INDEX "Item_inventoryfySku_key" ON "Item"("inventoryfySku");

-- CreateIndex
CREATE UNIQUE INDEX "Kit_inventoryfySku_key" ON "Kit"("inventoryfySku");

-- CreateIndex
CREATE UNIQUE INDEX "Order_inventoryfyOrderId_key" ON "Order"("inventoryfyOrderId");

