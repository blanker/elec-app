import { IconTrendingDown, IconTrendingUp, IconUsers, IconCalendarEvent, IconFileDescription, IconChartBar } from "@tabler/icons-react"
import CountUp from 'react-countup'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useShallow } from 'zustand/react/shallow'
import { Skeleton } from "@/components/ui/skeleton"

import useAccountStore from '@/store/useAccountStore';
import useRundateStore from '@/store/useRundateStore';
import useResponseStore from '@/store/useResponseStore';

// 可复用的统计卡片组件
function StatCard({ data, ActionIcon }) {
  const { title, value, prefix, suffix, decimals, trend, trendValue, description, subDescription } = data;
  const TrendIcon = trend === 'up' ? IconTrendingUp : IconTrendingDown;

  // 使用状态来确保组件正确渲染
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isClient ? (
            <CountUp
              start={0}
              end={value}
              prefix={prefix || ''}
              suffix={suffix || ''}
              decimals={decimals || 0}
              duration={2}
              separator=","
              useEasing={true}
              redraw={false}
            />
          ) : (
            `${prefix || ''}${value.toLocaleString()}${suffix || ''}`
          )}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trendValue && <><TrendIcon /> {trendValue}</>}
            {ActionIcon ? ActionIcon : null}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description} <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
          {subDescription}
        </div>
      </CardFooter>
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export function SectionCards() {


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <AccountCard />
      <RundateCard />
      <PublicityCard />
      <ResponsesCard />
    </div>
  );
}


function AccountCard() {
  const { accounts, loading, error, fetchAccounts } = useAccountStore(
    useShallow((state) => ({
      accounts: state.accounts,
      loading: state.loading,
      error: state.error,
      fetchAccounts: state.fetchAccounts
    }))
  );

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <StatCard
      data={{
        title: "商户数",
        value: accounts.length,
        // trend: "up",
        // trendValue: "+12.5%",
        // description: "Strong user retention",
        // subDescription: "Engagement exceed targets"
      }}
      ActionIcon={<IconUsers className="size-4" />}
    />
  );
}

function RundateCard() {
  const { rundates, loading, error, fetchRundates } = useRundateStore(
    useShallow((state) => ({
      rundates: state.rundates,
      loading: state.loading,
      error: state.error,
      fetchRundates: state.fetchRundates
    }))
  );

  useEffect(() => { fetchRundates(); }, [fetchRundates]);
  const { minDate, maxDate } = useMemo(() => {
    if (rundates.length === 0) {
      return { minDate: '-', maxDate: '' };
    }
    const minDate = rundates.reduce((acc, cur) => acc < cur.run_date ? acc : cur.run_date, rundates[0].run_date);
    const maxDate = rundates.reduce((acc, cur) => acc > cur.run_date ? acc : cur.run_date, rundates[0].run_date);
    return { minDate, maxDate };
  }, [rundates]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <StatCard
      data={{
        title: "运行日[需求响应申报]",
        value: rundates.length,
        description: `从: ${minDate}`,
        subDescription: `到: ${maxDate}`,
      }}
      ActionIcon={<IconCalendarEvent className="size-4" />}
    />
  );
}

function PublicityCard() {
  const {
    publicityInfos,
    loading,
    error,
    fetchPublicityInfos,
  } = useResponseStore(
    useShallow((state) => ({
      publicityInfos: state.publicityInfos,
      loading: state.loading,
      error: state.error,
      fetchPublicityInfos: state.fetchPublicityInfos,
    }))
  );

  // useEffect(() => { fetchPublicityInfos(); }, [fetchPublicityInfos]);

  const { total, minDate, maxDate, rundates, invitedIds } =
    useMemo(() => {
      let total = 0;
      let minDate = '';
      let maxDate = '';
      const rundates = {};
      const invitedIds = {};
      publicityInfos.forEach(({ run_date, invited_id }) => {
        total += 1;
        if (minDate === '') {
          minDate = run_date;
          maxDate = run_date;
        } else {
          minDate = minDate < run_date ? minDate : run_date;
          maxDate = maxDate > run_date ? maxDate : run_date;
        }
        rundates[run_date] = (rundates[run_date] || 0) + 1;
        invitedIds[invited_id] = (invitedIds[invited_id] || 0) + 1;
      });
      return {
        total,
        minDate,
        maxDate,
        rundates,
        invitedIds,
      }
    }, [publicityInfos]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <StatCard
      data={{
        title: "运行日[公示信息]",
        value: Object.keys(rundates).length,
        description: `${minDate} > ${maxDate}`,
        subDescription: `邀约ID数量: ${Object.keys(invitedIds).length}`,
      }}
      ActionIcon={<IconFileDescription className="size-4" />}
    />
  );
}

function ResponsesCard() {
  const { responses, loading, error, fetchResponses } = useResponseStore(
    useShallow((state) => ({
      responses: state.responses,
      loading: state.loading,
      error: state.error,
      fetchResponses: state.fetchResponses
    }))
  );

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);
  const { accounts, demands } = useMemo(() => {
    const accounts = {};
    const demands = {};
    responses.forEach(({ account_id, demand_no, cnt }) => {
      accounts[account_id] = (accounts[account_id] || 0) + cnt;
      demands[demand_no] = (demands[demand_no] || 0) + cnt;
    });
    return { accounts, demands };
  }, [responses]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <StatCard
      data={{
        title: "响应评估结果",
        value: responses.length,
        description: `户数: ${Object.keys(accounts).length} 总数: ${responses.reduce((acc, cur) => acc + cur.cnt, 0)}`,
        subDescription: `邀约ID数: ${Object.keys(demands).length}`,
      }}
      ActionIcon={<IconChartBar className="size-4" />}
    />
  );
}