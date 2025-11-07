/**
 * @file components/stats/popular-spots-chart.tsx
 * @description 인기 관광지 바 차트 컴포넌트
 *
 * 북마크 수 기준으로 인기 관광지 TOP 10을 바 차트로 표시합니다.
 */

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PopularSpot } from '@/actions/stats';

interface PopularSpotsChartProps {
  spots: PopularSpot[];
}

export function PopularSpotsChart({ spots }: PopularSpotsChartProps) {
  // 관광지 이름이 너무 길면 자르기
  const formatTitle = (title: string) => {
    if (title.length > 20) {
      return title.slice(0, 20) + '...';
    }
    return title;
  };

  const chartData = spots.map((spot) => ({
    name: formatTitle(spot.title),
    fullName: spot.title,
    count: spot.bookmark_count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>인기 관광지 TOP 10</CardTitle>
      </CardHeader>
      <CardContent>
        {spots.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={150}
              />
              <Tooltip
                formatter={(value: number) => [`${value}개`, '북마크 수']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-3))"
                name="북마크 수"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

