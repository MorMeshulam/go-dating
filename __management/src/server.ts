import 'dotenv/config';
import express from 'express';
import payload from 'payload';

const app = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET as string,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload admin: ${payload.getAdminURL()}`);
    },
  });

  const port = Number(process.env.PORT ?? 3001);

  app.listen(port, () => {
    payload.logger.info(`DateRight CMS running on http://localhost:${port}`);
  });
};

start().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
