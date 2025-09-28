-- DropForeignKey
ALTER TABLE "public"."file_attachments" DROP CONSTRAINT "file_attachments_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "public"."file_attachments" ALTER COLUMN "uploadedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."file_attachments" ADD CONSTRAINT "file_attachments_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
