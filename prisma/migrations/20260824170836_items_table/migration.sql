-- AlterTable
ALTER TABLE "Kit" DROP COLUMN "items";

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "festivalSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitLineItem" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KitLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_festivalSlug_idx" ON "Item"("festivalSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Item_festivalSlug_name_key" ON "Item"("festivalSlug", "name");

-- CreateIndex
CREATE INDEX "KitLineItem_kitId_idx" ON "KitLineItem"("kitId");

-- CreateIndex
CREATE UNIQUE INDEX "KitLineItem_kitId_itemId_key" ON "KitLineItem"("kitId", "itemId");

-- AddForeignKey
ALTER TABLE "KitLineItem" ADD CONSTRAINT "KitLineItem_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitLineItem" ADD CONSTRAINT "KitLineItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

