/**
 * @file components/stats/bookmark-trend-chart.tsx
 * @description 북마크 추이 라인 차트 컴포넌트
 *
 * 북마크 추이를 라인 차트로 표시하고, 기간 선택(일별/주별/월별) 기능을 제공합니다.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookmarkTrend, type BookmarkTrendData } from '@/actions/stats';

interface BookmarkTrendChartProps {
  initialData: BookmarkTrendData[];
}

export function BookmarkTrendChart({
  initialData,
}: BookmarkTrendChartProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [data, setData] = useState<BookmarkTrendData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const newData = await getBookmarkTrend(period);
        setData(newData);
      } catch (err) {
        console.error('[BookmarkTrendChart] 데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>북마크 추이</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={period === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('day')}
              disabled={isLoading}
              aria-label="일별 보기"
              aria-pressed={period === 'day'}
            >
              일별
            </Button>
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
              disabled={isLoading}
              aria-label="주별 보기"
              aria-pressed={period === 'week'}
            >
              주별
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('month')}
              disabled={isLoading}
              aria-label="월별 보기"
              aria-pressed={period === 'month'}
            >
              월별
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            로딩 중...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="북마크 수"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

