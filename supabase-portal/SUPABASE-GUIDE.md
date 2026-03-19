# Supabase 설정 가이드 — 이룸덴탈랩 포털

## 1단계: Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 → **Sign up** (GitHub 로그인 권장)
2. **New Project** → 프로젝트 이름: `iroom-portal`
3. **Database Region**: Asia (Seoul) 선택
4. **Create new project** 클릭
5. **Settings → API**에서 다음 값을 복사해두기:
   - `Project URL`: `https://xxxxxxxx.supabase.co`
   - `anon public` key: `eyJhbGciOiJIUzI1Ni...` (Starting with `eyJ...`)

---

## 2단계: SQL 테이블 생성

Supabase Dashboard → **SQL Editor** → 아래 SQL을 붙여넣고 **Run**:

```sql
-- ═══════════════════════════════════
-- 이룸덴탈랩 포털 — 테이블 생성
-- Supabase SQL Editor에서 실행
-- ═══════════════════════════════════

-- 1. cases (접수 케이스)
CREATE TABLE IF NOT EXISTS cases (
  id            BIGINT PRIMARY KEY,
  date          TEXT,
  clinic        TEXT,
  patient       TEXT,
  tooth         TEXT,
  type          TEXT,
  unit_type     TEXT DEFAULT 'single',
  is_remake     BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'working',
  ship_date     TEXT,
  memo          TEXT,
  done_viewed   BOOLEAN DEFAULT false
);

-- 2. clinics (거래처/치과)
CREATE TABLE IF NOT EXISTS clinics (
  id              BIGINT PRIMARY KEY,
  name            TEXT,
  business_number TEXT,
  phone           TEXT,
  director        TEXT,
  email           TEXT,
  password        TEXT,
  prices          JSONB DEFAULT '{}',
  remakes         JSONB DEFAULT '[]',
  price_adjust    INTEGER DEFAULT 0,
  permissions     JSONB DEFAULT '{"statistics":false,"sales":false,"archive":false}'
);

-- 3. prosthetics (보철 종류)
CREATE TABLE IF NOT EXISTS prosthetics (
  id    BIGINT PRIMARY KEY,
  name  TEXT,
  price INTEGER DEFAULT 0
);

-- 4. settings (설정 — key/value 스토어)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
```

---

## 3단계: Storage 버킷 생성 (파일 업로드용)

1. Supabase Dashboard → **Storage** → **New bucket**
2. **Bucket name**: `iroom-files`
3. **Public bucket**: ✅ 체크
4. **Create bucket**

---

## 4단계: Row Level Security (RLS) 설정

> ⚠️ RLS를 설정해야 외부 접근으로부터 데이터를 보호합니다.

**cases 테이블 RLS:**
```sql
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for cases"
ON cases FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

**clinics 테이블 RLS:**
```sql
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for clinics"
ON clinics FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

**prosthetics 테이블 RLS:**
```sql
ALTER TABLE prosthetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for prosthetics"
ON prosthetics FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

**settings 테이블 RLS:**
```sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for settings"
ON settings FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

**Storage 버킷 RLS:**
```sql
-- 파일 읽기允许
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO anon USING (bucket_id = 'iroom-files');

-- 파일 업로드 허용
CREATE POLICY "Allow public upload" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'iroom-files');

-- 파일 삭제 허용
CREATE POLICY "Allow public delete" ON storage.objects
FOR DELETE TO anon USING (bucket_id = 'iroom-files');
```

---

## 5단계: Vercel 환경변수 설정

### Vercel Dashboard에서 설정:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 두 개 추가:

| Name | Value | Environments |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` (본인 Supabase URL) | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (본인 anon public key) | Production, Preview, Development |

3. **Save**

---

## 6단계: 로컬 개발 시

```bash
cd supabase-portal
cp .env.example .env.local
# .env.local 파일을 열어서 Supabase URL과 Key 입력
npm install
npm run dev
```

---

## 7단계: 배포

```bash
# Vercel CLI로 배포
npm i -g vercel
vercel --prod
```

또는 Vercel Dashboard에서:
1. **Add New** → **Project**
2. GitHub 저장소 선택
3. **Environment Variables**에 위 2개 추가
4. **Deploy**

---

## 문제 해결

| 증상 | 해결책 |
|------|--------|
| `406 Not Acceptable` 에러 | Supabase URL/Key 값이 정확한지 확인 |
| 파일 업로드 안 됨 | Storage 버킷 RLS 정책 확인 |
| 데이터 안 보임 | `localStorage` vs Supabase 우선순위 확인 — `테스트/index.html`의 `loadData()` 함수 참고 |
| CORS 에러 | Supabase Dashboard → Settings → API → CORS 설정 확인 |
