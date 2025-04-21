import React, { useEffect } from "react";
import { Button } from "@/components/ui/button"
import { useShallow } from 'zustand/react/shallow'
import { format, parseISO } from "date-fns"
import SkeletonCard from "@/components/skeleton-card"
import { setLang, asyncGetAllData } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';
import { Export } from '@antv/s2-react-components';
import '@antv/s2-react/dist/s2-react.min.css';
import '@antv/s2-react-components/dist/s2-react-components.min.css'
import * as XLSX from 'xlsx';

import useRundateStore from '@/store/useRundateStore';
import useAccountStore from '@/store/useAccountStore';
import useResponseStore from "@/store/useResponseStore";

setLang('zh_CN')

import DateSelector from "@/components/date-selector";

export default function Page() {
    const {
        publicityInfos,
        responsesByRundate,
        loading,
        error,
        fetchPublicityInfos,
        getResponsesByRundate,
    } = useResponseStore(
        useShallow((state) => ({
            publicityInfos: state.publicityInfos,
            responsesByRundate: state.responsesByRundate,
            loading: state.loading,
            error: state.error,
            fetchPublicityInfos: state.fetchPublicityInfos,
            getResponsesByRundate: state.getResponsesByRundate,
        }))
    );
    const availableDates = React.useMemo(() => {
        const map = publicityInfos.reduce((acc, item) => {
            acc.set(item.run_date, true);
            return acc;
        }, new Map());
        return [...map.keys()].map(item => parseISO(item));
    }, [publicityInfos]);

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

    const adaptiveRef = React.useRef();
    const s2Ref = React.useRef(null);
    const [sheetInstance, setSheetInstance] = React.useState();

    const onMounted = (spreadsheet) => {
        console.log('onMounted:', spreadsheet);
        s2Ref.current = spreadsheet;
        setSheetInstance(spreadsheet);
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

    const handleSearch = () => {
        // 处理查询逻辑
        console.log("查询日期:", date);
        if (!date) return;
        getResponsesByRundate(format(date, "yyyy-MM-dd"));
    }

    const dataConfig = React.useMemo(() => {
        console.log('dataConfig:', responsesByRundate);
        return {
            ...defaultDataCfg,
            data: responsesByRundate,
        };
    }, [responsesByRundate]);

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
                    fileName={'响应评估结果公示_' + (date ? format(date, "yyyy-MM-dd") : '')}
                >
                    <Button>复制/导出</Button>
                </Export>
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
                        sheetType="table"
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

const defaultDataCfg = {
    "describe": "标准明细表数据。",

    "fields": {
        "columns": [
            "demand_no",
            "account_id",
            "account_name",
            "agree_status",
            "real_res",
            "good_res",
            "punish_res",
        ],
    },
    "meta": [
        {
            "field": "account_id",
            "name": "商户号"
        },
        {
            "field": "account_name",
            "name": "名称"
        },
        {
            "field": "agree_status",
            "name": "确认状态"
        },
        {
            "field": "appeal_record",
            "name": "appeal_record"
        },
        {
            "field": "demand_no",
            "name": "邀约ID"
        },
        {
            "field": "real_res",
            "name": "实际容量"
        },
        {
            "field": "good_res",
            "name": "有效容量"
        },
        {
            "field": "punish_res",
            "name": "考核容量"
        },

    ],
    data: [],
};

const s2Options = {
    width: 600,
    height: 480,
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
        }
    },
    style: {
        layoutWidthType: 'compact',    // 使用紧凑布局
    },
    // 减少不必要的渲染
    frozenRowHeader: true,
    frozenColHeader: true,
};

const onUpdate = (renderOptions) => {
    console.log('onUpdate:', renderOptions);
    return renderOptions;
};

const onUpdateAfterRender = (renderOptions) => {
    console.log('onUpdateAfterRender:', renderOptions);
};