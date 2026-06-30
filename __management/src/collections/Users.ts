import type { CollectionConfig } from 'payload/types';

import {
  AGE_BANDS,
  DATING_PACES,
  GENDERS,
  PRIVACY,
  READINESS,
  RELATIONSHIP_GOALS,
  SEEKING,
  toOptions,
  VALUES,
} from '../domain/profile';
import { matchOnRegister } from '../hooks/matchOnRegister';

/**
 * The `users` collection doubles as Payload's auth collection (CMS login) and
 * the dating-member profile store. Mock members are flagged `isMock` so the
 * matching agent only fires for real registrations.
 */
const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'gender', 'ageBand', 'role', 'isMock'],
  },
  hooks: {
    afterChange: [matchOnRegister],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'member',
      options: toOptions(['admin', 'member']),
      admin: { position: 'sidebar' },
    },
    {
      name: 'isMock',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Seeded demo profile (excluded from triggering matching).',
      },
    },
    { name: 'displayName', type: 'text' },
    { name: 'gender', type: 'select', options: toOptions(GENDERS) },
    {
      name: 'seekingGenders',
      type: 'select',
      hasMany: true,
      options: toOptions(SEEKING),
    },
    { name: 'ageBand', type: 'select', options: toOptions(AGE_BANDS) },
    {
      name: 'relationshipGoal',
      type: 'select',
      options: toOptions(RELATIONSHIP_GOALS),
    },
    { name: 'datingPace', type: 'select', options: toOptions(DATING_PACES) },
    {
      name: 'emotionalReadiness',
      type: 'select',
      options: toOptions(READINESS),
    },
    { name: 'privacy', type: 'select', options: toOptions(PRIVACY) },
    {
      name: 'topValues',
      type: 'select',
      hasMany: true,
      options: toOptions(VALUES),
    },
    { name: 'city', type: 'text' },
    { name: 'selfSummary', type: 'textarea' },
    {
      name: 'photo',
      type: 'group',
      admin: {
        description:
          'Image is skipped to save storage; these mock features stand in for image-based matching.',
      },
      fields: [
        {
          name: 'seed',
          type: 'text',
          admin: { description: 'Deterministic seed for a future avatar.' },
        },
        { name: 'appearanceScore', type: 'number' },
        {
          name: 'appearanceVector',
          type: 'json',
          admin: { description: 'Mock face-embedding vector for similarity.' },
        },
      ],
    },
  ],
};

export default Users;
