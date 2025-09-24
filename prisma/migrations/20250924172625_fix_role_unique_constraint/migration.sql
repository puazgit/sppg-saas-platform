-- DropIndex
DROP INDEX "public"."roles_name_sppgId_key";

-- CreateIndex
CREATE INDEX "roles_name_sppgId_idx" ON "public"."roles"("name", "sppgId");
