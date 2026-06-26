# URL Shortener — Backend

NestJS + Supabase (PostgreSQL). บริการนี้ย่อ URL ยาวเป็นโค้ดสั้น, redirect โค้ดสั้นไปปลายทาง และนับจำนวนคลิกเป็นฟีเจอร์เสริม

## งานหลักของระบบ (มีแค่นี้)
1. **Create** — รับ long URL คืน short code (เกิดครั้งเดียวต่อลิงก์)
2. **Redirect** — resolve short code → 302 ไป long URL (hot path เกิดทุกครั้งที่กด)
3. **Count** — นับคลิกต่อ redirect (ฟีเจอร์เสริม ยอมคลาดเคลื่อน/delay ได้)

---

## Design decisions — ห้ามเปลี่ยนโดยไม่ถามผมก่อน

ทุกข้อตัดสินใจมาแล้วโดยรู้ trade-off ถ้างานไหนต้องแก้ decision เหล่านี้ ให้ **หยุดถามผมก่อน** อย่าเปลี่ยนเอง

- **Short code generation: counter + base62**
  ใช้ DB auto-increment id แปลงเป็น base62 (`0-9 a-z A-Z`) ไม่ต้องเขียน collision handling เพราะ id ไม่ซ้ำอยู่แล้ว
  *แลกกับ:* โค้ดเรียงลำดับ/เดาได้ — รับได้เพราะลิงก์เป็น public

- **Storage: stored (ไม่ใช่ computed)**
  เก็บ `short_code` เป็นคอลัมน์จริง ห้าม derive จาก id ตอน read เพื่อเปิดทาง custom alias ในอนาคต

- **short_code column: `varchar`, `UNIQUE NOT NULL`, มี index**
  unique เป็นทั้งตาข่ายนิรภัย (กัน alias ชน, race, migrate ซ้ำ) และทำให้ lookup ตอน redirect เร็ว

- **Redirect: ใช้ HTTP 302 (ไม่ใช่ 301)**
  301 จะถูก browser cache แล้วไม่วิ่งมาหาเซิร์ฟเวอร์อีก → นับคลิกซ้ำไม่ได้ + แก้/ปิดลิงก์ไม่ได้ ส่วน 302 ทุกคลิกวิ่งมาหา = นับครบ + คุมลิงก์ได้

- **Click counting: fire-and-forget**
  ตอบ redirect **ก่อน** แล้วค่อย increment โดยไม่ await ผล คลิกหายตอน failure ยอมรับได้ (ฟีเจอร์เสริม) **ห้ามให้การนับ block หรือถ่วง redirect เด็ดขาด**

- **ยังไม่ใช้ Redis**
  นับลง DB ตรงๆ ไปก่อน Redis/queue คือทางแก้ตอน scale แต่ตอนนี้ over-engineering — แต่ให้แยก logic การนับเป็น service/method ของมันเอง เพื่อสลับไป Redis ภายหลังได้โดย **ไม่ต้องแตะ redirect path**

---

## Data model — ตาราง `links`

| column | type | notes |
|--------|------|-------|
| `id` | `bigint generated always as identity` | PK, ตัว counter |
| `short_code` | `varchar UNIQUE NOT NULL` | base62(id), มี index |
| `long_url` | `text NOT NULL` | ปลายทาง redirect |
| `click_count` | `bigint NOT NULL default 0` | increment แบบ fire-and-forget |
| `created_at` | `timestamptz NOT NULL default now()` | |

คอลัมน์ `deleted_at` (soft delete) และ custom alias: **ยังไม่ทำ** — ถามผมก่อนเพิ่ม

---

## Stack notes
- โครง NestJS: แยก `links` เป็น module ของตัวเอง (controller + service + dto)
- Supabase = PostgreSQL: ตอน insert ให้ใช้ row ที่ client คืนมา (หรือ `RETURNING id`) เพื่อได้ id มา generate โค้ดด้วย round-trip น้อยที่สุด การ insert แล้ว update short_code (2 รอบ) ยอมรับได้
- DTO ต้อง validate ว่า `long_url` เป็น URL http/https ที่ถูกต้อง

---

## ทำได้เลยไม่ต้องถาม (delegate ได้)
- scaffold module / controller / service / DTO
- validation, base62 encode/decode + unit test ของมัน
- boilerplate, config, Docker, test setup

## ต้องหยุดถามก่อน
- อะไรก็ตามที่เปลี่ยน decision ข้างบน
- design choice ใหม่ที่ไม่ได้ระบุไว้ (แก้ schema, เพิ่ม dependency, caching, auth model)
- อะไรที่กระทบ performance ของ redirect hot path

---

## Commands
*(ปรับให้ตรงกับ scripts จริงใน package.json)*
- dev: `npm run start:dev`
- test: `npm run test`
- build: `npm run build`
