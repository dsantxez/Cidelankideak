# Tablero — Setup guide

The board page (`tablero.html`) works in **two modes**:

- **Demo mode (default, no setup):** changes are saved only in *your own browser*
  (`localStorage`). Great for trying it out. The demo edit password is `cidetec`.
- **Live mode (Supabase):** changes are stored in a free cloud database and seen by
  **everyone**. Only people who know the shared password can edit.

Follow the steps below once to switch to live mode.

---

## 1. Create a free Supabase project

1. Go to <https://supabase.com> → **Start your project** → sign in with GitHub/email.
2. **New project**. Choose a name (e.g. `cidelankideak`), a region close to you
   (e.g. *West EU / Ireland*) and a database password (save it somewhere — you won't
   need it for the website).
3. Wait ~2 minutes for it to finish provisioning.

## 2. Create the table + security rules

In the left menu open **SQL Editor → New query**, paste **all** of this and press **Run**:

```sql
-- Cards table
create table public.board_cards (
  id         uuid primary key default gen_random_uuid(),
  stage      text not null default 'proposed',
  position   int  not null default 0,
  category   text not null default 'general',
  date       date,
  title_es   text, title_eu text, title_en text,
  desc_es    text, desc_eu text, desc_en text,
  created_at timestamptz default now()
);

-- Turn on Row Level Security
alter table public.board_cards enable row level security;

-- Anyone (visitors) can READ the board
create policy "public read" on public.board_cards
  for select using (true);

-- Only logged-in users (the shared editor account) can change it
create policy "auth write" on public.board_cards
  for all to authenticated using (true) with check (true);
```

Also enable live updates: **Database → Replication → `supabase_realtime`** →
add the `board_cards` table (optional but makes the board refresh automatically).

## 3. Create the single shared editor account

1. Left menu **Authentication → Users → Add user → Create new user**.
2. Email: `comite@cidelankideak.eus` (any email works — it's just the login id).
3. Password: choose the **shared password** the committee will use to edit.
4. Tick **Auto Confirm User** so no email confirmation is needed.

> Everyone on the committee logs in with this same email + password. To change the
> password later, edit this user here. (Authentication → Providers → Email: you can
> turn **off** "Allow new users to sign up" so nobody else can self-register.)

## 4. Plug the keys into the website

1. Left menu **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key (the long one labelled `anon` / `public`)
2. Open `tablero.js` and edit the four lines at the very top:

```js
const SUPABASE_URL      = 'https://xxxxx.supabase.co';   // your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';               // your anon public key
const EDITOR_EMAIL      = 'comite@cidelankideak.eus';    // the email from step 3
const DEMO_PASSWORD     = 'cidetec';                      // ignored once live
```

Save, upload the file to your host, and reload `tablero.html`. The "demo mode" note
disappears — you're live.

> The **anon public** key is safe to ship in the website; it only allows what the
> security policies above permit (read for everyone, write for logged-in editors).
> Never paste the *service_role* key into the site.

---

## How non-programmers use it day to day

1. Open the **Tablero** page → click **Acceder** → type the shared password.
2. **Add** a matter with the *Añadir tema* button under any column.
3. **Drag** a post-it from one column to another to change its stage.
4. **Edit/Delete** with the pencil icon on a card (or double-click it).
5. Click **Salir** when done. Visitors always see the latest board, read-only.

## Customising

- **Stages (columns):** edit the `STAGES` array in `tablero.js`.
- **Categories / colours:** edit the `CATEGORIES` array in `tablero.js` and the
  matching `--cat-*` colours in `styles.css`.
- **Texts/labels:** edit the `I18N` object in `tablero.js`.
