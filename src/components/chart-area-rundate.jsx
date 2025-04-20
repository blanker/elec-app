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

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
]

const chartConfig = {
  cnt: {
    label: "户数",
  },
}

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


  return (
    (<Card className="@container/card">
      <CardHeader>
        <CardTitle>运行日</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            运行日户数统计
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>

      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={rundates}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
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
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>)
  );
}
