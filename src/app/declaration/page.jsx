"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import SkeletonCard from "@/components/skeleton-card"

import { useShallow } from 'zustand/react/shallow'
import { setLang, asyncGetAllData } from '@antv/s2'

import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';
import { Export } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css'
import * as XLSX from 'xlsx';

import useRundateStore from '@/store/useRundateStore';
import useAccountStore from '@/store/useAccountStore';
import DateSelector from "@/components/date-selector";

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
    const s2Ref = React.useRef(null);
    const [sheetInstance, setSheetInstance] = React.useState();

    const onMounted = (spreadsheet) => {
        console.log('onMounted:', spreadsheet);
        s2Ref.current = spreadsheet;
        setSheetInstance(spreadsheet);
        spreadsheet.setTheme({
            rowCell: {
                text: {
                    textAlign: 'left',
                    textBaseline: 'middle',
                }
            }
        });
    };
    // 添加清理函数
    useEffect(() => {
        return () => {
            if (s2Ref.current) {
                try {
                    s2Ref.current.destroy();
                } catch (e) {
                    console.error('销毁S2实例时出错:', e);
                }
            }
        };
    }, []);

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

    const handleSearch = () => {
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
                } else {
                    // 没有数据的，直接插入16行数据
                    defaultTimes.forEach((time) => {
                        list.push({
                            account_id,
                            account_name: accounts.find(it => it.id === account_id)?.name ?? account_id,
                            time,
                            value: '-',
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
        // 低于平均值20 % 的有几个 80%
        // 高于平均值20 % 的有几个 120%
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
                const avg_80 = avg * 0.8;
                const avg_120 = avg * 1.2;
                const upAvg_80 = values.reduce((acc, it) => acc + (it > avg_80 ? 1 : 0), 0);
                const belowAvg_80 = values.reduce((acc, it) => acc + (it < avg_80 ? 1 : 0), 0);
                const upAvg_120 = values.reduce((acc, it) => acc + (it > avg_120 ? 1 : 0), 0);  // 120%
                const belowAvg_120 = values.reduce((acc, it) => acc + (it < avg_120 ? 1 : 0), 0);
                const max = values.reduce((acc, it) => Math.max(acc, it), values[0]);
                const min = values.reduce((acc, it) => Math.min(acc, it), values[0]);
                const upAavg = values.reduce((acc, it) => acc + (it > avg ? 1 : 0), 0);
                const belowAvg = values.reduce((acc, it) => acc + (it < avg ? 1 : 0), 0);
                computed.push({
                    account_id,
                    account_name,
                    time: '平均值',
                    avg: isNaN(avg) ? '-' : avg.toFixed(2),
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '最小值',
                    min: min,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '最大值',
                    max: max,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '高于平均值',
                    upAavg: isNaN(avg) ? '-' : upAavg,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '低于平均值',
                    belowAvg: isNaN(avg) ? '-' : belowAvg,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '低于平均值80%',
                    belowAvg_80: isNaN(avg) ? '-' : belowAvg_80,
                });
                computed.push({
                    account_id,
                    account_name,
                    time: '高于平均值120%',
                    upAvg_120: isNaN(avg) ? '-' : upAvg_120,
                });
            });
        console.log('computed', computed);
        return {
            ...defaultDataCfg,
            data: [...filtered, ...computed],
        };
    }, [rundateData, accounts]);

    return (
        <div className='p-4'>
            <div className='flex flex-row gap-2 items-center '>
                <DateSelector
                    date={date}
                    setDate={setDate}
                    disabledDays={disabledDays}
                />
                <Button
                    className='cursor-pointer'
                    onClick={handleSearch}
                >查询</Button>

                <Export
                    sheetInstance={sheetInstance}
                    fileName={'需求响应申报_' + (date ? format(date, "yyyy-MM-dd") : '')}
                >
                    <Button>复制/导出</Button>
                </Export>

                {/* <Button
                    onClick={
                        async () => {
                            // 拿到复制数据 (text/plain)
                            const data = await asyncGetAllData({
                                sheetInstance: sheetInstance,
                                split: ',',
                                formatOptions: true,
                                // formatOptions: {
                                //   formatHeader: true,
                                //   formatData: true
                                // },

                                // 同步导出
                                // async: false
                            });
                            console.log('data', data);
                            // 导出的数据格式是：(csv)
                            // 创建xlsx格式
                            const arrayOfArrayCsv = data[0].content.split("\n")
                                .map((row) => row.split(","));
                            const wb = XLSX.utils.book_new();
                            const newWs = XLSX.utils.aoa_to_sheet(arrayOfArrayCsv);
                            XLSX.utils.book_append_sheet(wb, newWs);

                            // XLSX.utils.aoa_to_sheet(wb, data);
                            XLSX.writeFileXLSX(wb, "out.xlsx");

                        }}
                >导出Excel</Button> */}
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
                        key={date ? format(date, "yyyy-MM-dd") : 'default'} // 添加key属性
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
const defaultTimes = [
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', "13:30", "13:45",
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', "15:30", "15:45",
]
const defaultDataCfg = {
    "describe": "标准交叉表数据。",
    sortParams: [
        {
            sortFieldId: 'time',
            sortMethod: 'ASC',
            sortBy: [
                '平均值', '最小值', '最大值',
                '高于平均值', '低于平均值', "高于平均值120%", "低于平均值80%",
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
            "value", "avg", "min", "max", "upAavg", "belowAvg", "upAvg_120", "belowAvg_80"
        ],
        "valueInCols": true
    },
    "meta": [
        {
            "field": "value",
            "name": "数值"
        },
        {
            "field": "avg",
            "name": "平均值"
        },
        {
            "field": "min",
            "name": "最小值"
        },
        {
            "field": "max",
            "name": "最大值"
        },
        {
            "field": "upAavg",
            "name": "数量"
        },
        {
            "field": "belowAvg",
            "name": "数量"
        },
        {
            "field": "upAvg_120",
            "name": "数量"
        },
        {
            "field": "belowAvg_80",
            "name": "数量"
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
    data: [],
};

const cellTextWordWrapStyle = {
    // 最大行数，文本超出后将被截断
    maxLines: 4,
    // 文本是否换行
    wordWrap: true,
    // 可选项见：https://g.antv.antgroup.com/api/basic/text#textoverflow
    textOverflow: 'ellipsis',
};
const s2Options = {
    width: 600,
    height: 480,
    seriesNumber: {
        enable: true,
        text: '序号',
    },
    tooltip: {
        enable: false
    },
    interaction: {
        hoverHighlight: false,
        selectedCellsSpotlight: false, // 禁用选中单元格聚光
        hideCellsOnSelection: false,   // 禁用选择时隐藏单元格
        copy: {
            // 开启复制
            enable: true,
            // 复制时携带表头
            withHeader: true,
            // 复制格式化后的数据
            withFormat: true
        },
        brushSelection: {
            dataCell: true,
            rowCell: true,
            colCell: true,
        },
    },
    style: {
        layoutWidthType: 'compact',    // 使用紧凑布局
        seriesNumberCell: cellTextWordWrapStyle,
        colCell: cellTextWordWrapStyle,
        cornerCell: cellTextWordWrapStyle,
        rowCell: {
            ...cellTextWordWrapStyle,
            height: 32,
        },
        // 数值不建议换行, 容易产生歧义
        // dataCell: cellTextWordWrapStyle,
    },
    // 减少不必要的渲染
    frozenRowHeader: true,
    frozenColHeader: true,
    conditions: {
        interval: [
            {
                field: 'value',
                mapping(value, data, cell) {
                    const defaultValueRange = cell.getValueRange();
                    // console.log('默认的最大最小值数值区间：', defaultValueRange);

                    return {
                        fill: '#80BFFF',
                        isCompare: false,
                    };
                },
            },
        ],
    }
};

const onUpdate = (renderOptions) => {
    console.log('onUpdate:', renderOptions);
    return renderOptions;
};

const onUpdateAfterRender = (renderOptions) => {
    console.log('onUpdateAfterRender:', renderOptions);
};
