import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
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
function StatCard({ data }) {
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
            <TrendIcon />
            {trendValue}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description} <TrendIcon className="size-4" />
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

function LoadingCard({ }) {

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription><Skeleton className='w-full h-full' /></CardDescription>
        <CardTitle><Skeleton className='w-full h-full' /></CardTitle>
      </CardHeader>
      <CardFooter>
        <Skeleton className='w-full h-full' />
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  // 这些数据可以从API获取
  const [cardsData, setCardsData] = useState([

    {
      title: "Growth Rate",
      value: 4.5,
      suffix: "%",
      decimals: 1,
      trend: "up",
      trendValue: "+4.5%",
      description: "Steady performance increase",
      subDescription: "Meets growth projections"
    }
  ]);



  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <AccountCard />
      <RundateCard />
      <ResponsesCard />
      {cardsData.map((card, index) => (
        <StatCard key={index} data={card} />
      ))}
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
        title: "户数",
        value: accounts.length,
        // trend: "up",
        // trendValue: "+12.5%",
        // description: "Strong user retention",
        // subDescription: "Engagement exceed targets"
      }}
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
        title: "工作日",
        value: rundates.length,
        description: `从:${minDate}`,
        subDescription: `到:${maxDate}`,
      }}
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

  useEffect(() => { fetchResponses(); }, [fetchResponses]);
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
        title: "响应结果",
        value: responses.length,
        description: `户数:${Object.keys(accounts).length} 总数:${responses.reduce((acc, cur) => acc + cur.cnt, 0)}`,
        subDescription: `需求数:${Object.keys(demands).length}`,
      }}
    />
  );
}