CREATE TABLE "ProjectSkill" (
 "projectId" TEXT NOT NULL, "skillId" TEXT NOT NULL, "usageNote" TEXT,
 CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("projectId", "skillId"),
 CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId");
CREATE TABLE "ApiRateLimit" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "ApiRateLimit_expiresAt_idx" ON "ApiRateLimit"("expiresAt");
WITH ranked AS (
 SELECT "id", ROW_NUMBER() OVER (PARTITION BY "projectId" ORDER BY "displayOrder", "id") AS rank
 FROM "ProjectMedia" WHERE "isActive" = true AND "isCover" = true
)
UPDATE "ProjectMedia" SET "isCover" = false FROM ranked WHERE "ProjectMedia"."id" = ranked."id" AND ranked.rank > 1;
CREATE UNIQUE INDEX "ProjectMedia_one_active_cover" ON "ProjectMedia" ("projectId") WHERE "isActive" = true AND "isCover" = true;
