/**
 * @file lib/api/bookmarks.ts
 * @description 북마크 관련 Supabase API 함수
 *
 * 북마크 추가, 삭제, 조회 기능을 제공합니다.
 * PRD 2.4.5 요구사항에 맞춰 구현되었습니다.
 *
 * 주요 기능:
 * 1. 사용자 조회 (clerk_id로 users 테이블 조회)
 * 2. 북마크 추가/제거
 * 3. 북마크 여부 확인
 * 4. 사용자 북마크 목록 조회
 *
 * @dependencies
 * - lib/supabase/clerk-client.ts - Client Component용 Supabase 클라이언트
 * - lib/supabase/server.ts - Server Component용 Supabase 클라이언트
 * - supabase/migrations/supabase.sql - 데이터베이스 스키마
 *
 * @see {@link /docs/prd.md#2.4.5-추가-기능} - PRD 요구사항
 * @see {@link /supabase/migrations/supabase.sql} - 데이터베이스 스키마
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';

/**
 * Clerk user ID로 Supabase users 테이블에서 사용자 조회
 * @param clerkId - Clerk User ID
 * @returns 사용자 정보 또는 null
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, clerk_id, name, created_at')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      console.error('[getUserByClerkId] Supabase 에러:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[getUserByClerkId] 예외 발생:', err);
    return null;
  }
}

/**
 * 현재 로그인한 사용자의 Supabase user_id 조회
 * @returns user_id 또는 null
 */
export async function getCurrentUserId() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    const user = await getUserByClerkId(userId);
    return user?.id || null;
  } catch (err) {
    console.error('[getCurrentUserId] 예외 발생:', err);
    return null;
  }
}

/**
 * 북마크 추가
 * @param contentId - 관광지 contentId
 * @returns 성공 여부
 */
export async function addBookmark(contentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = createClerkSupabaseClient();
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        content_id: contentId,
      });

    if (error) {
      // 중복 북마크인 경우 (unique_user_bookmark 제약조건)
      if (error.code === '23505') {
        return { success: false, error: '이미 북마크된 관광지입니다.' };
      }
      console.error('[addBookmark] Supabase 에러:', error);
      return { success: false, error: '북마크 추가에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[addBookmark] 예외 발생:', err);
    return { success: false, error: '북마크 추가 중 오류가 발생했습니다.' };
  }
}

/**
 * 북마크 삭제
 * @param contentId - 관광지 contentId
 * @returns 성공 여부
 */
export async function removeBookmark(contentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = createClerkSupabaseClient();
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId);

    if (error) {
      console.error('[removeBookmark] Supabase 에러:', error);
      return { success: false, error: '북마크 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[removeBookmark] 예외 발생:', err);
    return { success: false, error: '북마크 삭제 중 오류가 발생했습니다.' };
  }
}

/**
 * 북마크 여부 확인
 * @param contentId - 관광지 contentId
 * @returns 북마크 여부
 */
export async function getBookmarkStatus(contentId: string): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return false;
    }

    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 데이터가 없음 (북마크되지 않음)
        return false;
      }
      console.error('[getBookmarkStatus] Supabase 에러:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('[getBookmarkStatus] 예외 발생:', err);
    return false;
  }
}

/**
 * 사용자의 북마크 목록 조회
 * @param sortBy - 정렬 옵션 ('latest' | 'name' | 'area')
 * @returns 북마크 목록 (content_id 배열)
 */
export async function getUserBookmarks(sortBy: 'latest' | 'name' | 'area' = 'latest'): Promise<string[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return [];
    }

    const supabase = createClerkSupabaseClient();
    let query = supabase
      .from('bookmarks')
      .select('content_id, created_at')
      .eq('user_id', userId);

    // 정렬 옵션에 따라 정렬
    if (sortBy === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else {
      // 'name' 또는 'area'는 애플리케이션 레벨에서 정렬 (API 호출 후)
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('[getUserBookmarks] Supabase 에러:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // content_id 배열 반환
    return data.map((item) => item.content_id);
  } catch (err) {
    console.error('[getUserBookmarks] 예외 발생:', err);
    return [];
  }
}

/**
 * 여러 북마크 일괄 삭제
 * @param contentIds - 삭제할 관광지 contentId 배열
 * @returns 성공 여부
 */
export async function removeBookmarks(contentIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    if (contentIds.length === 0) {
      return { success: false, error: '삭제할 북마크가 없습니다.' };
    }

    const supabase = createClerkSupabaseClient();
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .in('content_id', contentIds);

    if (error) {
      console.error('[removeBookmarks] Supabase 에러:', error);
      return { success: false, error: '북마크 삭제에 실패했습니다.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[removeBookmarks] 예외 발생:', err);
    return { success: false, error: '북마크 삭제 중 오류가 발생했습니다.' };
  }
}

