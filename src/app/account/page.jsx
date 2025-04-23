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
        accounts,
        loading,
        error,
    } = useAccountStore(
        useShallow((state) => ({
            accounts: state.accounts,
            loading: state.loading,
            error: state.error,
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
            dataCell: {
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

    const dataConfig = React.useMemo(() => {
        console.log('dataConfig:', accounts);
        return {
            ...defaultDataCfg,
            data: accounts,
        };
    }, [accounts]);

    return (
        <div className='p-4'>
            <div className='flex flex-row gap-2 items-center '>

                <Export
                    sheetInstance={sheetInstance}
                    fileName={'商户列表'}
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
                        key={'account-table'} // 添加key属性
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
            "id",
            "name",
        ],
    },
    "meta": [
        {
            "field": "id",
            "name": "商户号"
        },
        {
            "field": "name",
            "name": "名称"
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
        enable: false,
        operation: {
            // 开启组内排序 （默认开启）
            sort: true,
            menu: {
                render: (props) => {
                    return <Menu {...props} />;
                },
            }
        },
    },
    sortParams: [
        { sortFieldId: 'id', sortMethod: 'ASC' },
        { sortFieldId: 'name', sortMethod: 'ASC' },
    ],
    showDefaultHeaderActionIcon: true,
    showSeriesNumber: true,
    hierarchyType: 'grid',
    hierarchyColumnHeader: {
        show: true,
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
        colCell: {
            ...cellTextWordWrapStyle,
            text: {
                textAlign: 'left',
                textBaseline: 'middle',
            }
        },
        cornerCell: {
            ...cellTextWordWrapStyle,
            text: {
                textAlign: 'left',
                textBaseline: 'middle',
            }
        },
        rowCell: {
            ...cellTextWordWrapStyle,
            height: 32,
            text: {
                textAlign: 'left',
                textBaseline: 'middle',
            }
        },
        dataCell: {
            text: {
                textAlign: 'left',
                textBaseline: 'middle',
            }
        }
        // 数值不建议换行, 容易产生歧义
        // dataCell: cellTextWordWrapStyle,
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