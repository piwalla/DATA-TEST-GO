/**
 * @file components/stats/recent-bookmarks.tsx
 * @description 최근 북마크 목록 테이블 컴포넌트
 *
 * 최근 북마크한 관광지 목록을 테이블 형태로 표시합니다.
 */

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentBookmark } from '@/actions/stats';

interface RecentBookmarksProps {
  bookmarks: RecentBookmark[];
}

export function RecentBookmarks({ bookmarks }: RecentBookmarksProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 북마크</CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            데이터가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="최근 북마크 목록">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium" scope="col">관광지</th>
                  <th className="text-left py-2 px-4 font-medium" scope="col">사용자</th>
                  <th className="text-left py-2 px-4 font-medium" scope="col">북마크일시</th>
                </tr>
              </thead>
              <tbody>
                {bookmarks.map((bookmark, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <Link
                        href={`/places/${bookmark.content_id}`}
                        className="text-primary hover:underline"
                      >
                        {bookmark.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{bookmark.user_name}</td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {formatDate(bookmark.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

