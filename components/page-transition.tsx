/**
 * @file components/page-transition.tsx
 * @description 페이지 전환 애니메이션 컴포넌트
 *
 * Next.js App Router에서 페이지 전환 시 Fade in과 Slide up 효과를 제공합니다.
 * design.md의 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. usePathname으로 경로 변경 감지
 * 2. Framer Motion의 AnimatePresence와 motion을 사용한 애니메이션
 * 3. Fade in (opacity: 0 → 1) 및 Slide up (y: 16 → 0) 효과
 *
 * @dependencies
 * - framer-motion: 페이지 전환 애니메이션 라이브러리
 * - next/navigation: usePathname 훅
 * - docs/design.md: 디자인 가이드 (애니메이션 스펙)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * 페이지 전환 애니메이션 래퍼 컴포넌트
 *
 * 경로 변경을 감지하여 Fade in과 Slide up 효과를 적용합니다.
 * design.md 요구사항:
 * - Fade in: opacity-0 → opacity-100
 * - Slide up: translate-y-4 → translate-y-0
 * - Duration: 300ms
 * - Ease: ease-in-out
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        id="main-content"
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 pb-64"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

