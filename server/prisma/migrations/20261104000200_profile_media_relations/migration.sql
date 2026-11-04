ALTER TABLE "User" ADD COLUMN "avatarMediaId" TEXT, ADD COLUMN "resumeMediaId" TEXT;

-- Preserve external URLs; link only matching files owned by the profile owner.
UPDATE "User" AS u SET "avatarMediaId" = m.id FROM "Media" AS m
WHERE u.avatar = m.url AND m."uploadedBy" = u.id AND m.type = 'IMAGE';
UPDATE "User" AS u SET "resumeMediaId" = m.id FROM "Media" AS m
WHERE u."resumeUrl" = m.url AND m."uploadedBy" = u.id AND m.type = 'DOCUMENT';

ALTER TABLE "User" ADD CONSTRAINT "User_avatarMediaId_fkey" FOREIGN KEY ("avatarMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_resumeMediaId_fkey" FOREIGN KEY ("resumeMediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "User_avatarMediaId_idx" ON "User"("avatarMediaId");
CREATE INDEX "User_resumeMediaId_idx" ON "User"("resumeMediaId");
CREATE INDEX "Media_uploadedBy_idx" ON "Media"("uploadedBy");
