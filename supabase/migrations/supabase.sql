-- =====================================================
-- 마이그레이션: My Trip (한국 관광지 정보 서비스) 데이터베이스 스키마
-- 작성일: 2025-01-27
-- 설명: My Trip 프로젝트의 전체 데이터베이스 스키마
--       - Clerk 인증 연동 (users.clerk_id)
--       - RLS 비활성화 (개발 환경, PRD 요구사항)
--       - PRD 2.4.5 북마크 기능 구현
--       - 북마크 목록 페이지 지원 (정렬: 최신순, 이름순, 지역별)
-- =====================================================

-- =====================================================
-- users 테이블 (Clerk 인증 연동)
-- =====================================================
-- Clerk 인증과 연동되는 사용자 정보를 저장하는 테이블
-- clerk_id를 통해 Clerk 사용자와 1:1 매핑
-- 
-- PRD 요구사항:
-- - 인증된 사용자만 북마크 사용 가능
-- - 로그인하지 않은 경우: 로그인 유도 또는 localStorage 임시 저장
-- - SyncUserProvider가 자동으로 Clerk 사용자를 동기화
--
-- 사용 예시:
--   - Clerk 로그인 시 자동으로 /api/sync-user 호출하여 동기화
--   - clerk_id로 사용자 조회 및 북마크 관리

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.users OWNER TO postgres;

-- 기존 테이블에 updated_at 컬럼이 없으면 추가 (기존 테이블 마이그레이션)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;
    END IF;
END $$;

-- Row Level Security (RLS) 비활성화
-- PRD 요구사항: RLS를 사용하지 않음 (개발 환경)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- 테이블 및 컬럼 설명
COMMENT ON TABLE public.users IS 'Clerk 인증과 연동되는 사용자 정보 - 북마크 기능을 위한 사용자 식별';
COMMENT ON COLUMN public.users.clerk_id IS 'Clerk User ID (예: user_2abc...) - UNIQUE 제약으로 중복 방지';
COMMENT ON COLUMN public.users.name IS '사용자 이름 (Clerk에서 동기화)';
COMMENT ON COLUMN public.users.created_at IS '사용자 생성 일시';
COMMENT ON COLUMN public.users.updated_at IS '사용자 정보 업데이트 일시';

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거 (기존 트리거가 없으면 생성)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at' 
        AND tgrelid = 'public.users'::regclass
    ) THEN
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON public.users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- bookmarks 테이블 (북마크 기능)
-- =====================================================
-- 사용자가 관광지를 북마크할 수 있는 기능
-- PRD 2.4.5 요구사항:
--   - 즐겨찾기 추가/제거
--   - 인증된 사용자만 사용 가능
--   - 북마크 목록 페이지 (/bookmarks) 지원
--   - 정렬: 최신순, 이름순, 지역별 (애플리케이션 레벨에서 처리)
--   - 일괄 삭제 기능 지원
--
-- 데이터 구조:
--   - content_id: 한국관광공사 API의 contentid (예: "125266")
--   - 관광지 상세 정보는 API에서 가져오므로 별도 저장 불필요
--   - UNIQUE 제약으로 동일 관광지 중복 북마크 방지

CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_id TEXT NOT NULL,  -- 한국관광공사 API의 contentid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- 동일 사용자가 같은 관광지를 중복 북마크하는 것을 방지
    CONSTRAINT unique_user_bookmark UNIQUE(user_id, content_id)
);

-- 테이블 소유자 설정
ALTER TABLE public.bookmarks OWNER TO postgres;

-- 인덱스 생성 (성능 최적화)
-- - user_id: 사용자별 북마크 목록 조회 최적화
-- - content_id: 특정 관광지의 북마크 수 조회 (선택 사항)
-- - created_at DESC: 최신순 정렬 최적화 (PRD 북마크 목록 페이지)
-- - 복합 인덱스: 사용자별 최신순 조회 최적화
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_content_id ON public.bookmarks(content_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON public.bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks(user_id, created_at DESC);

-- Row Level Security (RLS) 비활성화
-- PRD 요구사항: RLS를 사용하지 않음 (개발 환경)
ALTER TABLE public.bookmarks DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.bookmarks TO anon;
GRANT ALL ON TABLE public.bookmarks TO authenticated;
GRANT ALL ON TABLE public.bookmarks TO service_role;

-- 테이블 및 컬럼 설명
COMMENT ON TABLE public.bookmarks IS '사용자 북마크 정보 - 관광지 즐겨찾기 (PRD 2.4.5)';
COMMENT ON COLUMN public.bookmarks.user_id IS 'users 테이블의 사용자 ID (FK, CASCADE 삭제)';
COMMENT ON COLUMN public.bookmarks.content_id IS '한국관광공사 API contentid (예: "125266") - 관광지 상세정보는 API에서 조회';
COMMENT ON COLUMN public.bookmarks.created_at IS '북마크 생성 일시 (최신순 정렬용)';

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ My Trip 데이터베이스 마이그레이션 완료!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 생성된 테이블:';
    RAISE NOTICE '   1. users (Clerk 연동) - 인증된 사용자 정보';
    RAISE NOTICE '   2. bookmarks (관광지 북마크) - PRD 2.4.5';
    RAISE NOTICE '';
    RAISE NOTICE '🔓 RLS: 전체 비활성화 (DISABLE ROW LEVEL SECURITY)';
    RAISE NOTICE '🔑 인덱스:';
    RAISE NOTICE '   - users(clerk_id, created_at)';
    RAISE NOTICE '   - bookmarks(user_id, content_id, created_at, user_id+created_at)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 사용 예시:';
    RAISE NOTICE '';
    RAISE NOTICE '   -- 1. 사용자 생성 (Clerk 동기화 - 자동)';
    RAISE NOTICE '   INSERT INTO users (clerk_id, name)';
    RAISE NOTICE '   VALUES (''user_2abc123xyz'', ''홍길동'');';
    RAISE NOTICE '';
    RAISE NOTICE '   -- 2. 북마크 추가';
    RAISE NOTICE '   INSERT INTO bookmarks (user_id, content_id)';
    RAISE NOTICE '   SELECT id, ''125266'' FROM users WHERE clerk_id = ''user_2abc123xyz'';';
    RAISE NOTICE '';
    RAISE NOTICE '   -- 3. 사용자의 북마크 목록 조회 (최신순)';
    RAISE NOTICE '   SELECT b.* FROM bookmarks b';
    RAISE NOTICE '   JOIN users u ON b.user_id = u.id';
    RAISE NOTICE '   WHERE u.clerk_id = ''user_2abc123xyz''';
    RAISE NOTICE '   ORDER BY b.created_at DESC;';
    RAISE NOTICE '';
    RAISE NOTICE '   -- 4. 북마크 삭제';
    RAISE NOTICE '   DELETE FROM bookmarks';
    RAISE NOTICE '   WHERE user_id = (SELECT id FROM users WHERE clerk_id = ''user_2abc123xyz'')';
    RAISE NOTICE '   AND content_id = ''125266'';';
    RAISE NOTICE '';
    RAISE NOTICE '📝 PRD 참고:';
    RAISE NOTICE '   - 북마크 목록 페이지: /bookmarks';
    RAISE NOTICE '   - 정렬: 최신순(created_at), 이름순/지역별(API 조인)';
    RAISE NOTICE '   - 일괄 삭제: DELETE WHERE user_id = ... AND content_id IN (...);';
END $$;
