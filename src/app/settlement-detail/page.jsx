"use client"

import React, { useCallback, useState, useEffect } from "react"
import { zhCN } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { zhCN as zhCNDayPicker } from "react-day-picker/locale"
import { DatePicker, Space } from 'antd';
import { format, parseISO } from "date-fns"
import SkeletonCard from "@/components/skeleton-card"
import { setLang, asyncGetAllData, DataCell } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react';
import { Export } from '@antv/s2-react-components';
import '@antv/s2-react/dist/s2-react.min.css';
import '@antv/s2-react-components/dist/s2-react-components.min.css'
import * as XLSX from 'xlsx';
import { useThemeS2 } from "@/components/theme-provider"
import { useShallow } from 'zustand/react/shallow'
import useSettlementStore from "@/store/useSettlementStore";

setLang('zh_CN')

export default function Page() {
    const {
        settlementDetail,
        countByMonth,
        loading,
        error,
        fetchSettlementDetail,
        fetchCountByMonth,
    } = useSettlementStore(
        useShallow((state) => ({
            settlementDetail: state.settlementDetail,
            countByMonth: state.countByMonth,
            loading: state.loading,
            error: state.error,
            fetchSettlementDetail: state.fetchSettlementDetail,
            fetchCountByMonth: state.fetchCountByMonth,
        }))
    );

    const disabledDate = useCallback((currentDate) =>
        !countByMonth
            .some(item => item.run_month === currentDate.format('YYYY-MM'))
        , [countByMonth]);
    const [date, setDate] = React.useState()
    const s2Theme = useThemeS2();
    const onChange = (date, dateString) => {
        console.log(date, dateString);
        setDate(dateString);
    };

    const adaptiveRef = React.useRef();
    const [sheetInstance, setSheetInstance] = React.useState();
    const s2Ref = React.useRef(null);
    React.useEffect(() => {
        // console.log('S2Theme', sheetInstance, s2Theme)
        if (!sheetInstance) return;
        if (!s2Theme) return;
        // 统一设置主题 Schema, 色板，名称
        const { s2Theme: { name } } = s2Theme;
        // console.log('theme', name)
        sheetInstance.setThemeCfg({ name });
    }, [sheetInstance, s2Theme]);

    const onMounted = (spreadsheet) => {
        console.log('onMounted:', spreadsheet);
        setSheetInstance(spreadsheet);
        s2Ref.current = spreadsheet;
    };
    // 添加清理函数
    React.useEffect(() => {
        fetchCountByMonth();

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
        fetchSettlementDetail(date);
    }

    const dataConfig = React.useMemo(() => {
        console.log('dataConfig:', settlementDetail);
        return {
            ...defaultDataCfg,
            data: settlementDetail,
        };
    }, [settlementDetail]);

    return (
        <div className='p-4'>
            <div className='flex flex-row gap-2 items-center '>
                <DatePicker
                    onChange={onChange}
                    disabledDate={disabledDate}
                    picker="month"
                />
                <Button
                    className='cursor-pointer'
                    onClick={handleSearch}
                >查询</Button>

                <Export
                    sheetInstance={sheetInstance}
                    fileName={'结算明细信息_' + (date ? format(date, "yyyy-MM") : '')}
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
                        key={date ?? 'default'} // 添加key属性
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
            "run_month",
            "account_id",
            "run_date",
            "account_name",
            "res_fee_sum",
            "ass_fee_sum",
            "total_revenue",
            "bu_sharing",
            "la_sharing",
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
            "field": "run_month",
            "name": "月份"
        },
        {
            "field": "run_date",
            "name": "日期"
        },
        {
            "field": "res_fee_sum",
            "name": "响应费用(元)"
        },
        {
            "field": "ass_fee_sum",
            "name": "总响应考核费用(元)"
        },
        {
            "field": "total_revenue",
            "name": "总响应收益(元)"
        },
        {
            "field": "gain_sharing",
            "name": "收益分成比例"
        },
        {
            "field": "bu_sharing",
            "name": "用户分成收益(元)"
        },
        {
            "field": "la_sharing",
            "name": "负荷聚合商分成收益(元)"
        },
        
    ],
    data: [],
};

const s2Options = {
    width: 600,
    height: 480,
    dataCell: (viewMeta, spreadsheet) => {
        return new CustomDataCell(viewMeta, spreadsheet);
    },
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
    },
    // 减少不必要的渲染
    frozenRowHeader: true,
    frozenColHeader: true,
    // 配置小计总计显示
    totals: {
        col: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['account_id'],
          calcGrandTotals: {
            aggregation: 'SUM',
          },
          calcSubTotals: {
            aggregation: 'SUM',
          },
          // grandTotalsLabel: '总计',
          // subTotalsLabel: '小计',
        },
    }
};

const onUpdate = (renderOptions) => {
    console.log('onUpdate:', renderOptions);
    return renderOptions;
};

const onUpdateAfterRender = (renderOptions) => {
    console.log('onUpdateAfterRender:', renderOptions);
};

class CustomDataCell extends DataCell {
    initCell() {
        super.initCell();
    }

    renderImage() {
        this.drawTextShape();
    }

    getStyle(name) {
        // 重写单元格样式
        const defaultCellStyle = super.getStyle(name);
        return defaultCellStyle;
    }

    getBackgroundColor() {
        return super.getBackgroundColor();
    }

    getTextStyle() {
        const defaultTextStyle = super.getTextStyle();
        // console.log('getTextStyle:', this);
        if (['$$series_number$$', 'account_id', 'account_name', 'run_month']
            .includes(this.meta.valueField)) {
            return {
                ...defaultTextStyle,
                textAlign: 'left',
            };
        }
        // 使用默认处理
        return super.getTextStyle();
    }
}