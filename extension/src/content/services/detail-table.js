import { constants } from '../../config/menus';
import { clickDefaultMenuItem, clickSomeMenuItem } from "./menuService.js";
import { foundSelect, findSelectComponents } from "./navigation-select.js";
import { processing } from './tableParser';

const tableConfig = {
    table: 'settlement',
    columns: [
        { name: 'runMonth', title: '月份' },
        { name: 'sharePrice', title: '分摊价格(元/ 千瓦 · 次)' }, // √
        { name: 'monthLoad', title: '月度用电量(千瓦时)' }, // √
        { name: 'resFeeSum', title: '响应费用(元)' }, // √
        { name: 'assFeeSum', title: '响应考核费用(元)' }, // √
        { name: 'shareFee', title: '分摊费用(元)' },    // √
        { name: 'gainSharing', title: '收益分成比例' }, // √
        { name: 'laSharing', title: '负荷聚合商分成收益(元)' }, // √
        { name: 'buSharing', title: '用户分成收益(元)' }, // √
        { name: 'reserveCapFee', title: '响应考核费用(元)' },
        // { name: 'laSharing', title: '收益分成比例' },    // ×
        // { name: 'assFeeSum', title: '负荷聚合商分成收益(元)' }, // ×
        // { name: 'user', title: '用户分成收益(元)' },
        // { name: 'buSharing', title: '响应收益(元)' }, // ×
        { name: 'feeSum', title: '净收益(元)' },
    ],
}
const titleToNameMap = {};
tableConfig.columns.forEach(col => {
    titleToNameMap[col.title] = col.name;
});
let currentRow = 0;
export let found = false;
let tableHeaders = null;
export let tableData = null;
export let pageCount = 0;
export function resetTable() {
    found = false;
    tableHeaders = null;
    tableData = null;
    currentRow = 0;
}

export function findDetailTable() {
    if (!found) {
        const tbodyClass = constants.tbodyClass;
        const elements = document.querySelectorAll(tbodyClass);
        for (let element of elements) {
            // console.log('【detail-table】找到表格元素:', tbodyClass);
            const headers = getTableHeaders(element);
            if (isValieHeader(headers, tableConfig.columns)) {
                const data = parseTableData(element, headers);
                console.log('【detail-table】找到表格元素:', found, tableHeaders, data);
                if (data && data.tableData && data.tableData.length > 0) {
                    found = element;
                    tableHeaders = headers;
                    tableData = data;
                    console.log('【detail-table】找到有数据的表格元素:', found, tableHeaders, tableData);
                    if (processing) {
                        forceNavigateToNextPage();
                    }
                    break;
                }
            }
        }
    } // 找表格 found


}

function forceNavigateToNextPage() {
    setTimeout(() => {
        console.log('【detail-table】forceNavigateToNextPage');
        if (!found || !tableData) return;
        const { next, nextDisabled } = tableData;
        if (next && !nextDisabled) {
            console.log('【detail-table】找到下一页按钮:', next);
            next.click();
        }
    }, 600);
    setTimeout(() => {
        resetTable();
    }, 700);
}

export function parseTableData(found, tableHeaders) {
    console.log('【detail-table】parseTableData');
    const tbodyClass = constants.tbodyClass;

    if (!found) {
        console.error(`detail-table】没有合法的表格元素 ${tbodyClass}`);
        return;
    }

    const tbody = found;
    // 获取所有行
    const rows = tbody.querySelectorAll('tr');
    const tableData = [];
    console.log('【detail-table】找到所有行:', rows, tbody);
    // 遍历每一行
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) return;

        // 创建行数据对象
        const rowData = {};
        cells.forEach((cell, index) => {
            // 使用对应的标题作为键
            if (index < tableHeaders.length) {
                const headerTitle = tableHeaders[index];
                // 如果在映射中找到对应的字段名，则使用字段名作为键
                const fieldName = titleToNameMap[headerTitle];
                if (fieldName) {
                    rowData[fieldName] = cell.textContent.trim();
                }
            }
        });

        tableData.push(rowData);
    });

    // 找到tbody的父元素(.ant-table)
    let total = undefined;
    let current = undefined;
    let next = undefined;
    let nextDisabled = undefined;
    let last = undefined;
    let count = undefined;
    let first = undefined;
    const antTable = tbody.closest('.ant-table');
    if (antTable) {
        // 查找父元素的兄弟元素中的分页组件
        const parentElement = antTable.parentElement;
        if (parentElement) {
            // 在父元素内查找分页组件
            const pagination = parentElement.querySelector('.ant-table-pagination');
            if (pagination) {
                console.log('【detail-table】找到分页组件:', pagination);

                // 获取分页信息
                const totalElement = pagination.querySelector('.ant-pagination-total-text');
                if (totalElement) {
                    const totalText = totalElement.textContent.trim();
                    console.log('【detail-table】分页总数信息:', totalText);
                    total = totalText;

                    // 可以从文本中提取总记录数，例如 "共 100 条"
                    const totalMatch = totalText.match(/共\s*(\d+)\s*条/);
                    if (totalMatch && totalMatch[1]) {
                        const totalCount = parseInt(totalMatch[1], 10);
                        console.log('【detail-table】总记录数:', totalCount);
                    }
                }

                // 获取当前页码
                const currentPageElement = pagination.querySelector('.ant-pagination-item-active');
                if (currentPageElement) {
                    const currentPage = currentPageElement.textContent.trim();
                    console.log('【detail-table】当前页码:', currentPage);
                    current = currentPage;
                }

                // 获取下一页按钮
                const nextButton = pagination.querySelector('.ant-pagination-next');
                if (nextButton) {
                    console.log('【detail-table】找到下一页按钮:', nextButton);
                    next = nextButton;

                    // 检查下一页按钮是否禁用
                    nextDisabled = nextButton.classList.contains('ant-pagination-disabled');
                    console.log('【detail-table】下一页按钮是否禁用:', nextDisabled);

                    const pageItems = nextButton.parentElement.querySelectorAll('.ant-pagination-item');
                    if (pageItems && pageItems.length > 0) {
                        last = pageItems[pageItems.length - 1];
                        first = pageItems[0];
                        const text = last.textContent.trim();
                        console.log('【detail-table】第一页和最后一页:', text, first, last);
                        try {
                            count = parseInt(text, 10);
                            pageCount = count;
                            console.log('【detail-table】最后一页:', text, count);
                        } catch (e) { }
                    }
                } else {
                    console.log('【detail-table】未找到下一页按钮');
                }
            } else {
                console.log('【detail-table】未找到分页组件');
            }
        }
    }

    console.log('【detail-table】解析后的表格数据:', tableData);
    return {
        rows,
        tableData,
        total,
        current,
        next,
        nextDisabled,
        last,
        count,
    };
}

function isValieHeader(headers, columns) {
    if (!Array.isArray(headers)) return false;
    // 检查是否有必要的列
    const titleToNameMap = columns.reduce((map, col) => {
        map[col.title] = col.name;
        return map;
    }, {});
    const requiredColumns =
        Object.keys(titleToNameMap)
            .map(it => it.replaceAll(' ', ''));
    const result = requiredColumns.every(col =>
        headers.map(it => it.replaceAll(' ', ''))
            .includes(col));
    return result;
}

function getTableHeaders(tbody) {
    // 找到tbody的父元素
    const table = tbody.closest('table');
    if (!table) {
        console.warn('【detail-table】找不到表格元素');
        return [];
    }

    // 找到thead元素
    const thead = table.querySelector('thead');
    if (!thead) {
        console.warn('【detail-table】找不到表头元素');
        return [];
    }

    // 获取所有th元素
    const thElements = thead.querySelectorAll('th');
    if (!thElements || thElements.length === 0) {
        console.warn('【detail-table】表头中没有th元素');
        return [];
    }

    // 提取标题文本
    const headers = Array.from(thElements).map(th => {
        // 尝试获取title属性，如果没有则获取文本内容
        return th.getAttribute('title') || th.textContent.trim();
    });


    return headers;
}