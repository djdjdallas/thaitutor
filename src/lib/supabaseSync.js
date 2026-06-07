// ---------------------------------------------------------------------------
// SUPABASE SYNC — STUB (Phase 2)
// ---------------------------------------------------------------------------
// Phase 1 is fully offline: SQLite is the source of truth and nothing here runs.
// These no-op functions exist so the rest of the app can already call sync hooks
// without breaking. Wire them up in Phase 2 for cross-device backup.
//
// THE INTENDED DESIGN (offline-first with last-write-wins):
//   1. SQLite stays the source of truth on-device. The app never blocks on network.
//   2. When the device is online AND the user is signed in, push local changes up
//      and pull remote changes down. On conflict, newest `updated_at` wins.
//   3. Each row is scoped to the signed-in user via Row-Level Security so users
//      can only ever read/write their own progress.
//
// SUPABASE TABLES + RLS TO CREATE IN PHASE 2 (run in the Supabase SQL editor):
//
//   create table card_state (
//     user_id uuid references auth.users not null default auth.uid(),
//     card_id text not null,
//     box int not null default 1,
//     last_reviewed date,
//     updated_at timestamptz not null default now(),
//     primary key (user_id, card_id)
//   );
//   alter table card_state enable row level security;
//   create policy "own rows" on card_state
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//
//   create table daily_log (
//     user_id uuid references auth.users not null default auth.uid(),
//     date date not null,
//     listening bool default false,
//     speaking bool default false,
//     vocab bool default false,
//     freeplay bool default false,
//     updated_at timestamptz not null default now(),
//     primary key (user_id, date)
//   );
//   alter table daily_log enable row level security;
//   create policy "own rows" on daily_log
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//
// Then: npx expo install @supabase/supabase-js, create a client, and implement
// the two functions below.
// ---------------------------------------------------------------------------

export async function syncUp() {
  // TODO (Phase 2): read locally-changed rows, upsert to Supabase.
  return { synced: false, reason: "stub" };
}

export async function syncDown() {
  // TODO (Phase 2): pull remote rows, merge into SQLite (newest updated_at wins).
  return { synced: false, reason: "stub" };
}

// Convenience hook the app can fire after writes. No-op until Phase 2.
export async function maybeSync() {
  return; // intentionally does nothing in Phase 1
}
