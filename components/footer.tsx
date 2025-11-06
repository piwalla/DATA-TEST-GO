/**
 * @file components/footer.tsx
 * @description 푸터 컴포넌트
 *
 * My Trip 서비스의 푸터 컴포넌트입니다.
 * design.md의 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 내용:
 * - 저작권 정보
 * - About, Contact 링크
 * - 한국관광공사 API 제공 표시
 *
 * @dependencies
 * - docs/design.md - 디자인 가이드
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* 저작권 정보 */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              My Trip © {currentYear}
            </p>
          </div>

          {/* 링크 */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">
              한국관광공사 API 제공
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

