/**
 * @file components/header.tsx
 * @description 헤더 컴포넌트
 *
 * My Trip 서비스의 헤더 컴포넌트입니다.
 * design.md의 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * - 로고 (My Trip)
 * - 검색창 (헤더 통합)
 * - 로그인/회원가입 버튼 (Clerk)
 * - Sticky 헤더 (스크롤 시 shadow 표시)
 * - 반응형 디자인 (모바일: 햄버거 메뉴)
 *
 * @dependencies
 * - @clerk/nextjs - 인증
 * - components/ui/button - 버튼 컴포넌트
 * - docs/design.md - 디자인 가이드
 */

'use client';

import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-blue">My Trip</span>
        </Link>

        {/* 데스크톱: 검색창 + 로그인 */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-4 md:px-8">
          {/* 검색창 (향후 구현) */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="관광지 검색..."
              className="w-full rounded-full border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              disabled
              aria-label="관광지 검색"
            />
          </div>
        </div>

        {/* 로그인/회원가입 버튼 */}
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default" size="sm" className="hidden sm:inline-flex">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* 모바일: 햄버거 메뉴 */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 모바일: 검색창 (햄버거 메뉴 열릴 때) */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="관광지 검색..."
                className="w-full rounded-full border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                disabled
                aria-label="관광지 검색"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

