-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "e_bill" TEXT;

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "contractor_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEWayBill" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "e_way_bill" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderEWayBill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEWayBill" ADD CONSTRAINT "OrderEWayBill_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
