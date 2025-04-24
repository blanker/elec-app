"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useShallow } from 'zustand/react/shallow'
import useRundateStore from '@/store/useRundateStore';
import useResponseStore from '@/store/useResponseStore';

const chartConfig = {
  visitors: {
    label: "商户数",
  },
  cnt: {
    label: "需求响应申报",
    color: "hsl(var(--chart-1))", // 使用 CSS 变量
  },
  account_cnt: {
    label: "响应结果评估",
    color: "hsl(var(--chart-2))", // 使用 CSS 变量
  }
}

export default ChartAreaRundate;
export function ChartAreaRundate() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const { rundates, loading, error, fetchRundates } = useRundateStore(
    useShallow((state) => ({
      rundates: state.rundates,
      loading: state.loading,
      error: state.error,
      fetchRundates: state.fetchRundates
    }))
  );

  const { statGroupByRundate, loadingStat, errorState, fetchStatGroupByRundate } = useResponseStore(
    useShallow((state) => ({
      statGroupByRundate: state.statGroupByRundate,
      loadingStat: state.loading,
      errorState: state.error,
      fetchStatGroupByRundate: state.fetchStatGroupByRundate
    }))
  );

  React.useEffect(() => { fetchStatGroupByRundate(); }, [fetchStatGroupByRundate])

  const chartData = React.useMemo(() => {
    console.log('chart-area-rundate', rundates, statGroupByRundate);
    const map = {};
    statGroupByRundate.forEach((item) => {
      map[item.run_date] = { ...item };
    });
    rundates.forEach((item) => {
      map[item.run_date] = {
        ...map[item.run_date],
        ...item,
      }
    });
    console.log('chart-area-rundate', map, Object.values(map));
    return Object.values(map);
  }, [rundates, statGroupByRundate]);

  return (
    (<Card className="@container/card">
      <CardHeader>
        <CardTitle>运行日</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            运行日统计
          </span>
        </CardDescription>

      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCnt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAccountCnt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="run_date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // 使用 date-fns 格式化日期
                try {
                  return format(parseISO(value), "MM月dd日", { locale: zhCN });
                } catch (e) {
                  return value;
                }
              }} />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // 使用 date-fns 格式化工具提示中的日期
                    try {
                      return format(parseISO(value), "yyyy年MM月dd日", { locale: zhCN });
                    } catch (e) {
                      return value;
                    }
                  }}
                  indicator="dot" />
              } />
            <Area
              dataKey="cnt"
              type="natural"
              fill="url(#fillCnt)"
              stroke="var(--color-chart-1)"
              stackId="a" />
            <Area
              dataKey="account_cnt"
              type="natural"
              fill="url(#fillAccountCnt)"
              stroke="var(--color-chart-2)"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}
