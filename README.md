# Pavitra Web Studio
1. `npm install`
2. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
3. Supabase > Authentication > Users: add a user with the admin email used in schema.sql (pavitrash789@gmail.com).
4. Copy `.env.example` to `.env.local` and fill the three values (service role key stays server-side).
5. `npm run dev`, then visit `/` and `/admin`. Deploy on Vercel and add the same env vars there.
