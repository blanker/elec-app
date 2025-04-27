import { constants } from '../../config/menus';
import { clickDefaultMenuItem, clickSomeMenuItem } from "./menuService.js";
import { foundSelect, findSelectComponents } from "./navigation-select.js";
import {
    found as foundDetail,
    findDetailTable,
    resetTable as resetTableDetal,
} from "./detail-table.js";
import { menuParent, foundMenu, defaultMenuItem } from './tableParser.js';
import { getValidMenu } from '../utils/domUtils.js'

const tableConfig = {
    table: 'publicity-info',
    columns: [
        { name: 'run_date', title: '运行日' },
        { name: 'invited_id', title: '邀约ID' },
        { name: 'start_date', title: '公示开始时间' },
        { name: 'end_date', title: '公示结束时间' },
    ],
}
const titleToNameMap = {};
tableConfig.columns.forEach(col => {
    titleToNameMap[col.title] = col.name;
});
let currentRow = 0;
let found = false;
let tableHeaders = null;
let tableData = null;


// 设置表格观察器
export function setupDynamicNavigationTableHandler() {
    let debounceTimer;
    const observer = new MutationObserver((mutationsList) => {
        clearTimeout(debounceTimer);
        observer.disconnect(); // 找到后停止观察
        debounceTimer = setTimeout(() => {
            // 菜单是否被卸载
            if (foundMenu && !document.body.contains(menuParent)) {
                console.log('【navigation-table】【MENU】菜单被卸载');
                menuParent = false;
                defaultMenuItem = null;
                foundMenu = false;
            }

            // 检查当前观察的表格是否已被卸载
            if (found && !document.body.contains(found)) {
                console.log('【navigation-table】表格已被卸载，重新开始观察 document.body');
                found = false;
                tableHeaders = null;
                tableData = null;
            }

            if (foundSelect && !document.body.contains(foundSelect)) {
                console.log('【navigation-table】SELECT已被卸载，重新开始观察 document.body');
                foundSelect = false;
            }

            if (foundDetail && !document.body.contains(foundDetail)) {
                console.log('【navigation-table】detail table已被卸载，重新开始观察 document.body');
                resetTableDetal();
            }

            // for (let mutation of mutationsList) {
            //     console.log('【navigation-table】子节点发生变化:', mutation);
            // }
            // 如果还没找到菜单，尝试查找
            if (!foundMenu) {
                const elements = document.querySelectorAll('.ant-menu');
                for (let element of elements) {
                    console.log('【observers】找到根菜单元素:', '.ant-menu');
                    const { targetMenu, invalidMenuItem } = getValidMenu(element) ?? {};
                    console.log('【observers】找到有效菜单元素:', targetMenu);
                    if (targetMenu) {
                        // 找到目标菜单，更新状态
                        menuParent = element;
                        foundMenu = targetMenu;
                        defaultMenuItem = invalidMenuItem;
                        break;
                    }
                }
            }

            // 找表格
            if (!found) {
                const tbodyClass = constants.tbodyClass;
                const elements = document.querySelectorAll(tbodyClass);
                for (let element of elements) {
                    // console.log('【navigation-table】找到表格元素:', tbodyClass);
                    const { headers, isValid } = getTableHeadersForSeprateTable(element);
                    // console.log('【navigation-table】表格标题:', headers, isValid);
                    if (isValid) {
                        found = element;
                        tableHeaders = headers;
                        tableData = parseTableData();

                        if (tableData && tableData.tableData && Array.isArray(tableData.tableData) && tableData.tableData.length > 0) {
                            // 发送表格数据
                            try {
                                window.postMessage({
                                    type: 'ajaxTools',
                                    to: 'background',
                                    action: 'sendToBackground',
                                    key: 'table',
                                    table: tableConfig.table,
                                    data: tableData.tableData,
                                }, '*');
                            } catch (e) {
                                console.error('【navigation-table】发送数据到 background 失败:', e);
                            }
                            console.log('【navigation-table】发送表格数据', tableData);
                        } else {
                            console.log('【navigation-table】没有数据了');

                        }
                        break;
                    }
                }
            } // 找表格 found

            // 找select
            if (!foundSelect) {
                foundSelect = findSelectComponents();
                if (foundSelect) {
                    console.log('【navigation-table】找到select', foundSelect);
                }
            }

            // 找detail table
            findDetailTable();

            // 观察当前表： 为了监控当前表被卸载，只能再document.body上继续观察
            observer.observe(document.body, config);
        }, 0);

    });

    // 配置观察选项
    const config = {
        attributes: false,         // 观察属性变化
        childList: true,          // 观察子节点变化
        subtree: true,            // 观察所有后代节点
        characterData: true,     // 不观察文本内容变化
        attributeOldValue: false,  // 记录旧属性值
        characterDataOldValue: false
    };

    // 开始观察目标节点
    observer.observe(document.body, config);
    return observer;
}

function getTableHeadersForSeprateTable(tbody) {
    // console.log('【navigation-table】getTableHeaders', tbody);
    const wrapper = tbody.closest('.ant-table-wrapper');
    if (!wrapper) {
        console.warn('【navigation-table】找不到表格wrapper元素');
        return { isValid: false };
    }

    // 找到thead元素
    const thead = wrapper.querySelector('.ant-table-header .ant-table-thead');
    if (!thead) {
        console.warn('【navigation-table】找不到表头元素');
        return { isValid: false };
    }

    // 获取所有th元素
    const thElements = thead.querySelectorAll('th');
    if (!thElements || thElements.length === 0) {
        console.warn('【navigation-table】表头中没有th元素');
        return { isValid: false };
    }

    // 提取标题文本
    const headers = Array.from(thElements).map(th => {
        // 尝试获取title属性，如果没有则获取文本内容
        return th.getAttribute('title') || th.textContent.trim();
    });

    // console.log('【navigation-table】表格标题:', headers);
    return { headers, isValid: isValidTable(headers, tableConfig.columns) };
}

function isValidTable(headers, columns) {
    // 检查是否有必要的列
    const requiredColumns = Object.keys(titleToNameMap);
    return requiredColumns.every(col => headers.includes(col));
}

// 执行下一行操作
export function nextRow() {
    console.log('【navigation-table】nextRow', currentRow, tableData);
    // 留足时间处理数据
    setTimeout(() => {
        if (found && tableData && tableData.tableData && Array.isArray(tableData.tableData) && tableData.tableData.length > 0) {
            // 下一行
            currentRow = currentRow + 1;
            // 处理完成
            if (currentRow >= tableData.tableData.length) {
                console.log('【navigation-table】nextRow 处理完成', currentRow, tableData);
                return;
            }

            // 点击下一行
            const row = found.querySelector(`tr:nth-child(${currentRow + 1})`);
            if (!row) {
                console.warn(`【navigation-table】找不到第 ${currentRow + 1} 行`);
                return;
            }
            // 点击行
            row.click();
            console.log('【navigation-table】nextRow 点击下一行', row);
        }
    }, 10000);
}

export function parseTableData() {
    console.log('【navigation-table】parseTableData');
    const tbodyClass = constants.tbodyClass;

    if (!found) {
        console.error(`【navigation-table】没有合法的表格元素 ${tbodyClass}`);
        return;
    }

    const tbody = found;
    // 获取所有行
    const rows = tbody.querySelectorAll('tr');
    const tableData = [];

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
    let first = undefined;
    const antTable = tbody.closest('.ant-table');
    if (antTable) {
        // 查找父元素的兄弟元素中的分页组件
        const parentElement = antTable.parentElement;
        if (parentElement) {
            // 在父元素内查找分页组件
            const pagination = parentElement.querySelector('.ant-table-pagination');
            if (pagination) {
                console.log('【navigation-table】找到分页组件:', pagination);

                // 获取分页信息
                const totalElement = pagination.querySelector('.ant-pagination-total-text');
                if (totalElement) {
                    const totalText = totalElement.textContent.trim();
                    console.log('【navigation-table】分页总数信息:', totalText);
                    total = totalText;

                    // 可以从文本中提取总记录数，例如 "共 100 条"
                    const totalMatch = totalText.match(/共\s*(\d+)\s*条/);
                    if (totalMatch && totalMatch[1]) {
                        const totalCount = parseInt(totalMatch[1], 10);
                        console.log('【navigation-table】总记录数:', totalCount);
                    }
                }

                // 获取当前页码
                const currentPageElement = pagination.querySelector('.ant-pagination-item-active');
                if (currentPageElement) {
                    const currentPage = currentPageElement.textContent.trim();
                    console.log('【navigation-table】当前页码:', currentPage);
                    current = currentPage;
                }

                // 获取下一页按钮
                const nextButton = pagination.querySelector('.ant-pagination-next');
                if (nextButton) {
                    console.log('【navigation-table】找到下一页按钮:', nextButton);
                    next = nextButton;

                    // 检查下一页按钮是否禁用
                    nextDisabled = nextButton.classList.contains('ant-pagination-disabled');
                    console.log('【navigation-table】下一页按钮是否禁用:', nextDisabled);

                    const pageItems = nextButton.parentElement.querySelectorAll('.ant-pagination-item');
                    if (pageItems && pageItems.length > 0) {
                        last = pageItems[pageItems.length - 1];
                        first = pageItems[0];
                        console.log('【navigation-table】第一页和最后一页:', first, last);
                    }
                } else {
                    console.log('【navigation-table】未找到下一页按钮');
                }
            } else {
                console.log('【navigation-table】未找到分页组件');
            }
        }
    }

    console.log('解析后的表格数据:', tableData);
    return {
        rows,
        tableData,
        total,
        current,
        next,
        nextDisabled,
        last,
    };
}

export function isFinished() {
    if (!found) return true;
    if (!tableData) return true;
    if (!tableData.tableData) return true;
    if (!tableData.tableData.length) return true;
    if (tableData.tableData.length <= 1) return true;
    // 第一次执行完, currentRow = 0 => 1
    // 第二次执行完， currentRow = 1 => 2
    // 第三次执行完， currentRow = 2 => 3
    // 第四次执行完， currentRow = 3 => 4
    // 第五次执行完， currentRow = 4 => 5
    // 第六次执行完， currentRow = 5 => 6
    // 假如总共有6行数据
    currentRow = currentRow + 1;
    if (currentRow >= tableData.tableData.length) {
        return true;
    }
    // 先跳转到一个默认页面
    // 然后再跳回本页面
    // 然后点击第currentRow行，然后继续处理数据
    setTimeout(() => {
        clickDefaultMenuItem();
    }, 1000);

    setTimeout(() => {
        clickSomeMenuItem(2);
    }, 2000);

    setTimeout(() => {
        navigateRow();
    }, 6000);
    return false;
}

function navigateRow() {
    console.log('【isFinished】found', found, currentRow);
    if (!found) {
        setTimeout(() => {
            navigateRow();
        }, 6000);
    } else {
        const elements = Array.from(found.querySelectorAll('tr'));
        if (currentRow < elements.length) {
            const element = elements[currentRow];
            element.click();
        }
    }
}