import type { CollectionConfig } from 'payload/types';

/**
 * One document per member, holding the matching agent's ranked results.
 * Regenerated whenever the member registers / their profile changes.
 */
const Matches: CollectionConfig = {
  slug: 'matches',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['member', 'generatedBy', 'generatedAt'],
  },
  fields: [
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    { name: 'generatedAt', type: 'date' },
    { name: 'generatedBy', type: 'text' },
    {
      name: 'results',
      type: 'array',
      labels: { singular: 'Match', plural: 'Matches' },
      fields: [
        {
          name: 'candidate',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        { name: 'score', type: 'number', required: true },
        {
          name: 'reasons',
          type: 'array',
          fields: [{ name: 'reason', type: 'text' }],
        },
      ],
    },
  ],
};

export default Matches;
