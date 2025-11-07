/**
 * @file components/stats/recent-users.tsx
 * @description 최근 가입자 목록 테이블 컴포넌트
 *
 * 최근 가입한 사용자 목록을 테이블 형태로 표시합니다.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentUser } from '@/actions/stats';

interface RecentUsersProps {
  users: RecentUser[];
}

export function RecentUsers({ users }: RecentUsersProps) {
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
        <CardTitle>최근 가입자</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            데이터가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="최근 가입자 목록">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium" scope="col">이름</th>
                  <th className="text-left py-2 px-4 font-medium" scope="col">가입일시</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
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

