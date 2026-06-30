import 'dotenv/config';
import payload from 'payload';

import { generateMockUsers } from './agents/mockData';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@dateright.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123';
const MOCK_COUNT = Number(process.env.SEED_MOCK_COUNT ?? 1000);

const seed = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET as string,
    local: true,
  });

  // 1. CMS admin login.
  const existingAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isMock: false,
        displayName: 'CMS Admin',
      },
    });
    payload.logger.info(`Created admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    payload.logger.info(`Admin already exists: ${ADMIN_EMAIL}`);
  }

  // 2. Mock members (idempotent: skip if we already have enough).
  const existingMocks = await payload.count({
    collection: 'users',
    where: { isMock: { equals: true } },
  });

  if (existingMocks.totalDocs >= MOCK_COUNT) {
    payload.logger.info(
      `Already have ${existingMocks.totalDocs} mock users — skipping seed.`,
    );
    process.exit(0);
  }

  const mocks = generateMockUsers(MOCK_COUNT);
  let created = 0;

  for (const mock of mocks) {
    try {
      await payload.create({ collection: 'users', data: mock });
      created += 1;
      if (created % 100 === 0) {
        payload.logger.info(`Seeded ${created}/${MOCK_COUNT} mock users…`);
      }
    } catch (error) {
      // Most likely a duplicate email on a re-run — safe to skip.
      payload.logger.warn(`Skipped ${mock.email}: ${(error as Error).message}`);
    }
  }

  payload.logger.info(`Done. Created ${created} mock users.`);
  process.exit(0);
};

seed().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
