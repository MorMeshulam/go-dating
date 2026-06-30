# DateRight — Management (CMS + Matching Agent)

A Node.js content-management backend built on **Payload CMS** with **MongoDB**.
It owns the `users` and `matches` collections, seeds 1000 mock members, and runs
the **matching agent** that returns a new member's best 5 matches on registration.

## Stack
- Payload CMS 2 (Express, Node.js) — admin UI + auth at `/admin`
- MongoDB (local, `mongodb://127.0.0.1:27017/dateright`)
- Matching agent in `src/agents/matchingAgent.ts`

## Prerequisites
MongoDB must be running locally:

```bash
# installed via: brew tap mongodb/brew && brew install mongodb-community
mongod --dbpath ./.mongo/data --port 27017
```

## Setup

```bash
cd __management
cp .env.example .env        # adjust PAYLOAD_SECRET etc.
npm install
npm run seed                # creates the admin + 1000 mock members
npm run dev                 # starts the CMS on http://localhost:3001/admin
```

Log in at `http://localhost:3001/admin` with the seed admin
(`admin@dateright.local` / `changeme123` by default).

## Collections
- **users** — Payload auth collection. CMS admins + dating members. Mock members
  are flagged `isMock` and carry a mock `photo.appearanceVector` (no image stored)
  so image-similarity can be scored.
- **matches** — one document per member with the agent's ranked top 5.

## Matching agent
`computeTopMatches(member, candidates, 5)` filters to mutually-eligible
candidates and scores intent, pace, readiness, shared values, privacy, age,
location, and a mock image-similarity signal. The `users.afterChange` hook runs
it automatically when a real (`isMock: false`, `role: member`) user registers.
