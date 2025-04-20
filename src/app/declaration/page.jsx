"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { useEffect } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import SkeletonCard from "@/components/skeleton-card"

import { zhCN as zhCNDayPicker } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useShallow } from 'zustand/react/shallow'
import { setLang, PivotSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

import useRundateStore from '@/store/useRundateStore';
import useAccountStore from '@/store/useAccountStore';
setLang('zh_CN')

export default function Page() {
    const { rundates, rundateData, loading, error, fetchRundates, fetchRundateData } = useRundateStore(
        useShallow((state) => ({
            rundates: state.rundates,
            rundateData: state.rundateData,
            loading: state.loading,
            error: state.error,
            fetchRundates: state.fetchRundates,
            fetchRundateData: state.fetchRundateData
        }))
    );
    const { accounts } = useAccountStore(
        useShallow((state) => ({
            accounts: state.accounts,
        }))
    );
    const adaptiveRef = React.useRef();

    useEffect(() => { fetchRundates(); }, [fetchRundates]);

    // 将字符串日期转换为Date对象
    const availableDates = React.useMemo(() =>
        rundates.map(item => parseISO(item.run_date)),
        [rundates]);
    // console.log(availableDates, rundates);

    const [date, setDate] = React.useState()

    // 禁用不在可用日期列表中的日期
    const disabledDays = React.useCallback((day) => {
        if (!availableDates) return true;
        // 检查当前日期是否在可用日期列表中
        return !availableDates.some(availableDate =>
            day.getDate() === availableDate.getDate() &&
            day.getMonth() === availableDate.getMonth() &&
            day.getFullYear() === availableDate.getFullYear()
        );
    }, [availableDates]);

    const handelSearch = () => {
        // 处理查询逻辑
        console.log("查询日期:", date);
        if (!date) return;
        fetchRundateData(format(date, "yyyy-MM-dd"));
    }

    const dataConfig = React.useMemo(() => {
        // console.log(rundateData, accounts);
        const list = [];
        const times = {};
        rundateData.forEach((item) => {
            const { loads_use, account_id } = item;
            try {
                if (loads_use) {
                    const loads = JSON.parse(loads_use);
                    // console.log(loads);
                    // key = 'H03D00'
                    // 把key解析成03:00
                    Object.entries(loads).map(([key, value]) => {
                        const split = key.split(/[HD]/);
                        const time = `${split[1]}:${split[2]}`;
                        const valueNum = Number(value);
                        times[time] = Math.max((times[time] ?? 0), valueNum);
                        list.push({
                            account_id,
                            account_name: accounts.find(it => it.id === account_id)?.name ?? account_id,
                            time: `${split[1]}:${split[2]}`,
                            value: valueNum,
                        });
                    })
                }
            } catch (e) {
                console.warn('处理出错了', e);
            }
        });
        const zeroTimes = Object.entries(times)
            .filter(([_, value]) => value === 0)
            .map(([key]) => key);
        console.log(list, times, zeroTimes);
        const filtered = list.filter(item =>
            !zeroTimes.includes(item.time));
        // 平均值是多少
        // 最高值，最低值
        // 高于平均值的有几个
        // 低于平均值的有几个
        // 低于平均值20 % 的有几个
        // 高于平均值20 % 的有几个
        const compute = {};
        filtered.forEach(item => {
            const { account_id, account_name, value } = item;
            const old = compute?.[account_id]?.values ?? [];
            compute[account_id] = {
                account_name,
                values: [value, ...old],
            }
        });
        console.log('compute', compute);
        const computed = [];
        Object.entries(compute)
            .forEach(([account_id, { account_name, values }]) => {
                const avg = values.reduce((acc, it) => acc + it, 0) / values.length;
                const max = values.reduce((acc, it) => Math.max(acc, it), values[0]);
                const min = values.reduce((acc, it) => Math.min(acc, it), values[0]);
                const upAavg = values.reduce((acc, it) => acc + (it > avg ? 1 : 0), 0);
                const belowAvg = values.reduce((acc, it) => acc + (it < avg ? 1 : 0), 0);
                computed.push({
                    account_id,
                    account_name,
                    time: '平均值',
                    value: avg.toFixed(2),
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '最小值',
                    value: min,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '最大值',
                    value: max,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '高于平均值',
                    value: upAavg,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '低于平均值',
                    value: belowAvg,
                });
            });
        console.log('computed', computed);
        return {
            "describe": "标准交叉表数据。",
            sortParams: [
                {
                    sortFieldId: 'time',
                    sortMethod: 'ASC',
                    sortBy: [
                        '平均值', '最小值', '最大值',
                        '高于平均值', '低于平均值',
                        '12:00', '12:15', '12:30', '12:45',
                        '13:00', '13:15', "13:30", "13:45",
                        '14:00', '14:15', '14:30', '14:45',
                        '15:00', '15:15', "15:30", "15:45",
                    ],
                    // sortFunc: (params) => {
                    //     console.log('sortFunc', params);
                    //     return params.data.sort((a, b) => a.localeCompare(b));
                    // },
                },
            ],
            "fields": {
                "rows": [
                    "account_id",
                    "account_name"
                ],
                "columns": [
                    "time",
                ],
                "values": [
                    "value"
                ],
                "valueInCols": true
            },
            "meta": [
                {
                    "field": "value",
                    "name": "数值"
                },
                {
                    "field": "account_id",
                    "name": "户号"
                },
                {
                    "field": "account_name",
                    "name": "名称"
                },
                {
                    "field": "time",
                    "name": "时间"
                },
            ],
            data: [...filtered, ...computed]
        };
    }, [rundateData, accounts]);

    return (
        <div className='p-4'>
            <div className='flex flex-row gap-2 items-center '>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            locale={zhCNDayPicker}
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={disabledDays}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    className='cursor-pointer'
                    onClick={handelSearch}
                >查询</Button>
            </div>

            {loading && <div className='p-4'><SkeletonCard /></div>}
            {error && <div>加载数据出错: {error}</div>}

            {!loading && !error &&
                <div
                    ref={adaptiveRef}
                    className='w-full mt-4'
                    style={{
                        height: 'calc(100vh - 140px)',
                    }}
                >
                    <SheetComponent
                        dataCfg={dataConfig}
                        options={s2Options}
                        onMounted={onMounted}
                        onUpdate={onUpdate}
                        onUpdateAfterRender={onUpdateAfterRender}
                        adaptive={{
                            width: true,
                            height: true,
                            getContainer: () => adaptiveRef.current // 或者使用 document.getElementById(containerId)
                        }}
                    />
                </div>
            }
        </div>
    );
}

const s2Options = {
    width: 600,
    height: 480,
};
const onMounted = (spreadsheet) => {
    console.log('onMounted:', spreadsheet);
};

const onUpdate = (renderOptions) => {
    console.log('onUpdate:', renderOptions);

    return renderOptions;
};

const onUpdateAfterRender = (renderOptions) => {
    console.log('onUpdateAfterRender:', renderOptions);
};

const dataCfg = {
    "describe": "标准交叉表数据。",
    "fields": {
        "rows": [
            "province",
            "city"
        ],
        "columns": [
            "type",
            "sub_type"
        ],
        "values": [
            "number"
        ],
        "valueInCols": true
    },
    "meta": [
        {
            "field": "number",
            "name": "数量"
        },
        {
            "field": "province",
            "name": "省份"
        },
        {
            "field": "city",
            "name": "城市"
        },
        {
            "field": "type",
            "name": "类别"
        },
        {
            "field": "sub_type",
            "name": "子类别"
        }
    ],
    "data": [
        {
            "number": 7789,
            "province": "浙江省",
            "city": "杭州市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 2367,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 3877,
            "province": "浙江省",
            "city": "宁波市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 4342,
            "province": "浙江省",
            "city": "舟山市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 5343,
            "province": "浙江省",
            "city": "杭州市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 632,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 7234,
            "province": "浙江省",
            "city": "宁波市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 834,
            "province": "浙江省",
            "city": "舟山市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 945,
            "province": "浙江省",
            "city": "杭州市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 1304,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 1145,
            "province": "浙江省",
            "city": "宁波市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 1432,
            "province": "浙江省",
            "city": "舟山市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 1343,
            "province": "浙江省",
            "city": "杭州市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 1354,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 1523,
            "province": "浙江省",
            "city": "宁波市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 1634,
            "province": "浙江省",
            "city": "舟山市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 1723,
            "province": "四川省",
            "city": "成都市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 1822,
            "province": "四川省",
            "city": "绵阳市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 1943,
            "province": "四川省",
            "city": "南充市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 2330,
            "province": "四川省",
            "city": "乐山市",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 2451,
            "province": "四川省",
            "city": "成都市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 2244,
            "province": "四川省",
            "city": "绵阳市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 2333,
            "province": "四川省",
            "city": "南充市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 2445,
            "province": "四川省",
            "city": "乐山市",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 2335,
            "province": "四川省",
            "city": "成都市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 245,
            "province": "四川省",
            "city": "绵阳市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 2457,
            "province": "四川省",
            "city": "南充市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 2458,
            "province": "四川省",
            "city": "乐山市",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 4004,
            "province": "四川省",
            "city": "成都市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 3077,
            "province": "四川省",
            "city": "绵阳市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 3551,
            "province": "四川省",
            "city": "南充市",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 352,
            "province": "四川省",
            "city": "乐山市",
            "type": "办公用品",
            "sub_type": "纸张"
        }
    ],
    "totalData": [
        {
            "number": 26193,
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 49709,
            "type": "家具"
        },
        {
            "number": 23516,
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 29159,
            "type": "办公用品"
        },
        {
            "number": 12321,
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 16838,
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 18375,
            "province": "浙江省",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 14043,
            "province": "浙江省",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 4826,
            "province": "浙江省",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 5854,
            "province": "浙江省",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 7818,
            "province": "四川省",
            "type": "家具",
            "sub_type": "桌子"
        },
        {
            "number": 9473,
            "province": "四川省",
            "type": "家具",
            "sub_type": "沙发"
        },
        {
            "number": 7495,
            "province": "四川省",
            "type": "办公用品",
            "sub_type": "笔"
        },
        {
            "number": 10984,
            "province": "四川省",
            "type": "办公用品",
            "sub_type": "纸张"
        },
        {
            "number": 13132,
            "province": "浙江省",
            "city": "杭州市",
            "type": "家具"
        },
        {
            "number": 2288,
            "province": "浙江省",
            "city": "杭州市",
            "type": "办公用品"
        },
        {
            "number": 15420,
            "province": "浙江省",
            "city": "杭州市"
        },
        {
            "number": 2999,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "家具"
        },
        {
            "number": 2658,
            "province": "浙江省",
            "city": "绍兴市",
            "type": "办公用品"
        },
        {
            "number": 5657,
            "province": "浙江省",
            "city": "绍兴市"
        },
        {
            "number": 11111,
            "province": "浙江省",
            "city": "宁波市",
            "type": "家具"
        },
        {
            "number": 2668,
            "province": "浙江省",
            "city": "宁波市",
            "type": "办公用品"
        },
        {
            "number": 13779,
            "province": "浙江省",
            "city": "宁波市"
        },
        {
            "number": 5176,
            "province": "浙江省",
            "city": "舟山市",
            "type": "家具"
        },
        {
            "number": 3066,
            "province": "浙江省",
            "city": "舟山市",
            "type": "办公用品"
        },
        {
            "number": 8242,
            "province": "浙江省",
            "city": "舟山市"
        },
        {
            "number": 4174,
            "province": "四川省",
            "city": "成都市",
            "type": "家具"
        },
        {
            "number": 6339,
            "province": "四川省",
            "city": "成都市",
            "type": "办公用品"
        },
        {
            "number": 10513,
            "province": "四川省",
            "city": "成都市"
        },
        {
            "number": 4066,
            "province": "四川省",
            "city": "绵阳市",
            "type": "家具"
        },
        {
            "number": 3322,
            "province": "四川省",
            "city": "绵阳市",
            "type": "办公用品"
        },
        {
            "number": 7388,
            "province": "四川省",
            "city": "绵阳市"
        },
        {
            "number": 4276,
            "province": "四川省",
            "city": "南充市",
            "type": "家具"
        },
        {
            "number": 6008,
            "province": "四川省",
            "city": "南充市",
            "type": "办公用品"
        },
        {
            "number": 10284,
            "province": "四川省",
            "city": "南充市"
        },
        {
            "number": 4775,
            "province": "四川省",
            "city": "乐山市",
            "type": "家具"
        },
        {
            "number": 2810,
            "province": "四川省",
            "city": "乐山市",
            "type": "办公用品"
        },
        {
            "number": 7585,
            "province": "四川省",
            "city": "乐山市"
        },
        {
            "number": 32418,
            "province": "浙江省",
            "type": "家具"
        },
        {
            "number": 10680,
            "province": "浙江省",
            "type": "办公用品"
        },
        {
            "number": 43098,
            "province": "浙江省"
        },
        {
            "number": 17291,
            "province": "四川省",
            "type": "家具"
        },
        {
            "number": 18479,
            "province": "四川省",
            "type": "办公用品"
        },
        {
            "number": 35770,
            "province": "四川省"
        },
        {
            "number": 78868
        }
    ]
}