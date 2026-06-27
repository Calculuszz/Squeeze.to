-- URL Shortener: links table
-- Matches the data model defined in CLAUDE.md

CREATE TABLE IF NOT EXISTS links (
  -- id: ใช้ GENERATED ALWAYS AS IDENTITY (มาตรฐาน ANSI SQL) แทน BIGSERIAL (แบบเก่า)
  -- ข้อดี: ป้องกันการใส่ค่า id ตรงๆ ช่วยไม่ให้เลข Sequence คลาดเคลื่อน และมีความปลอดภัยสูงกว่า
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  short_code    varchar UNIQUE NOT NULL,
  long_url      text NOT NULL,
  click_count   bigint NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Explicit index on short_code for fast redirect lookups.
-- (The UNIQUE constraint already creates one, but this serves as documentation.)
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links (short_code);

---

-- Postgres function for atomic click count increment.
-- Called via Supabase RPC: supabase.rpc('increment_click_count', { code: '...' })
CREATE OR REPLACE FUNCTION increment_click_count(code text)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE links
  SET click_count = click_count + 1
  WHERE short_code = code;
$$;
