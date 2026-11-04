// One-time, additive import of the supplied resume. Never replaces edited CMS values.
require('dotenv/config');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const source = fs.readFileSync(
  path.join(__dirname, '../../docs/reference/resume-import-source.ts'),
  'utf8',
);
const exportsBox = {};
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: exportsBox },
);
const cv = exportsBox.cvContent;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { email: cv.email } });
    if (!user) throw new Error('Resume owner not found. Import cancelled.');
    const fields = {
      role: cv.role,
      summary: cv.summary,
      phone: cv.phone,
      location: cv.location,
      githubUrl: cv.github,
      linkedinUrl: cv.linkedin,
    };
    const missing = Object.fromEntries(
      Object.entries(fields).filter(([key]) => !user[key]),
    );
    if (Object.keys(missing).length)
      await tx.user.update({ where: { id: user.id }, data: missing });
    for (const [index, entry] of cv.education.entries()) {
      if (
        !(await tx.timeline.findFirst({
          where: { type: 'EDUCATION', organization: entry.organization },
        }))
      ) {
        const year = entry.dates.match(/\d{4}/)[0];
        await tx.timeline.create({
          data: {
            type: 'EDUCATION',
            title: entry.title,
            organization: entry.organization,
            location: entry.location,
            description: `${entry.awardingBody}\n${entry.dates}`,
            startDate: new Date(`${year}-01-01T00:00:00Z`),
            displayOrder: 20 + index,
          },
        });
      }
    }
    for (const [index, badge] of cv.training.entries()) {
      if (
        !(await tx.timeline.findFirst({
          where: {
            type: 'TRAINING',
            title: badge.title,
            organization: cv.trainingIssuer,
          },
        }))
      )
        await tx.timeline.create({
          data: {
            title: badge.title,
            organization: cv.trainingIssuer,
            type: 'TRAINING',
            startDate: new Date(badge.issuedOn),
            credentialUrl: cv.credentialProfile,
            displayOrder: 100 + index,
          },
        });
    }
  });
  console.log(
    'Resume profile and AWS training import completed; existing values preserved.',
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
