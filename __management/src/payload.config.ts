import path from 'path';

import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';

import Matches from './collections/Matches';
import Users from './collections/Users';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3001',
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/dateright',
  }),
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  collections: [Users, Matches],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
