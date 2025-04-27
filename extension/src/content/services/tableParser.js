import { titleToNameMap } from '../utils/mappers';
import { constants, menus } from '../../config/menus';
import _ from 'lodash';

export let currentMenu = null;
export let foundMenu = false;
export let menuParent = false;
// li元素
export let defaultMenuItem = null;
export let currentMenuIndex = 0;
export let table = null;
export let processing = false;
export function setCurrentMenu(menu) {
  console.log('【tableParser】setCurrentMenu', menu);
  currentMenu = menu;
}
export function getCurrentMenu() {
  console.log('【tableParser】getCurrentMenu', currentMenu);
  return currentMenu;
}
export const setFoundMenu = (menu) => { foundMenu = menu };
export const setDefaultMenu = (item) => { defaultMenuItem = item };
export const setCurrentMenuIndex = (index) => { currentMenuIndex = index };
export const setTable = (tableName) => { table = tableName };
export const setProcessing = (value) => { processing = value };
export const resetState = () => {
  console.log('resetState');
  currentMenuIndex = 0,
    currentMenu = null,
    processing = false
};
export const nextMenu = () => {
  console.log('【tableParser】nextMenu', foundMenu, currentMenuIndex);
  console.log('【tableParser】nextMenu', currentMenuIndex, foundMenu.length);
  if (foundMenu && Array.isArray(foundMenu)) {
    if (currentMenuIndex < foundMenu.length) {
      currentMenuIndex = currentMenuIndex + 1;
      return true;
    } else {
      resetState();
      return false;
    }
  }
  return false;
}

// 初始化时从 localStorage 恢复状态
function initStateFromStorage() {
  try {
    console.log('【tableParser】从 localStorage 恢复状态');
    const storedMenuIndex = localStorage.getItem('currentMenuIndex');
    if (storedMenuIndex) {
      currentMenuIndex = parseInt(storedMenuIndex, 10);
    }

    const storedProcessing = localStorage.getItem('processing');
    if (storedProcessing) {
      processing = storedProcessing === 'true';
    }
  } catch (e) {
    console.error('【tableParser】从 localStorage 恢复状态失败:', e);
  }
  console.log('【tableParser】从 localStorage 恢复状态', processing, currentMenuIndex);
}

// 初始化状态
initStateFromStorage();

// in_ant_table_body
function getTableHeaders2(tbody) {
  // console.log('getTableHeaders2', tbody);
  const wrapper = tbody.closest('.ant-table-wrapper');
  if (!wrapper) {
    console.warn('【tableParser】找不到表格wrapper元素');
    return [];
  }

  // 找到thead元素
  const thead = wrapper.querySelector('.ant-table-header .ant-table-thead');
  if (!thead) {
    console.warn('【tableParser】找不到表头元素');
    return [];
  }

  // 获取所有th元素
  const thElements = thead.querySelectorAll('th');
  if (!thElements || thElements.length === 0) {
    console.warn('【tableParser】表头中没有th元素');
    return [];
  }

  // 提取标题文本
  const headers = Array.from(thElements).map(th => {
    // 尝试获取title属性，如果没有则获取文本内容
    return th.getAttribute('title') || th.textContent.trim();
  });

  // console.log('表格标题:', headers);
  const extra = getExtraValue();
  return { headers, isValid: isValidTable(headers), extra };
}

// 获取表格标题
export function getTableHeaders(tbody) {
  let thisMenu = getCurrentMenu();

  // 如果还没点击开始，则默认找第一个
  if (!currentMenu) {
    thisMenu = menus[0];
  }
  console.log('【tableParser】getTableHeaders 最终使用的菜单:', thisMenu);

  if (thisMenu.in_ant_table_body) {
    return getTableHeaders2(tbody);
  }

  // 找到tbody的父元素
  const table = tbody.closest('table');
  if (!table) {
    console.warn('【tableParser】找不到表格元素');
    return [];
  }

  // 找到thead元素
  const thead = table.querySelector('thead');
  if (!thead) {
    console.warn('【tableParser】找不到表头元素');
    return [];
  }

  // 获取所有th元素
  const thElements = thead.querySelectorAll('th');
  if (!thElements || thElements.length === 0) {
    console.warn('【tableParser】表头中没有th元素');
    return [];
  }

  // 提取标题文本
  const headers = Array.from(thElements).map(th => {
    // 尝试获取title属性，如果没有则获取文本内容
    return th.getAttribute('title') || th.textContent.trim();
  });

  // console.log('【tableParser】表格标题:', headers);
  const extra = getExtraValue();
  return { headers, isValid: isValidTable(headers), extra };
}

function getExtraValue() {
  // console.log('getExtraValue currentMenu', currentMenu);
  if (!currentMenu) {
    return {};
  }

  const { extra } = currentMenu;
  if (!extra) {
    return {};
  }
  // console.log('getExtraValue extra', extra);
  const extraValue = {};
  Object.entries(extra).forEach(([key, value]) => {
    // console.log('getExtraValue key and value', key, value);

    const elements = document.querySelectorAll(value.element);
    if (elements.length === 0) {
      console.warn(`找不到元素 ${value.element}`);
      return;
    } else {
      // console.info(`找到元素 ${value.element}`, elements);
      let val = undefined;
      for (let e of Array.from(elements)) {
        const match = e.textContent.match(value.pattern);
        // console.log(e, match, e.textContent, value.pattern);
        if (match && match[1]) {
          val = match[1];
          break;
        }
      }
      if (val) {
        extraValue[key] = val;
      }
    }

  });
  console.log('【tableParser】getExtraValue extraValue', extraValue);
  if (extraValue && Object.keys(extraValue).length > 0) {
    postMessage({ type: 'ajaxTools', to: 'pageScript', key: 'extra', value: extraValue });
  }
  return extraValue;

}
export function parseTableData() {
  const extra = getExtraValue();
  // console.log('parseTableData');
  const tbodyClass = constants.tbodyClass;

  let found = false;
  const elements = document.querySelectorAll(tbodyClass);
  for (let element of elements) {
    // console.log('【tableParser】找到目标元素:', tbodyClass);
    const { headers, isValid } = getTableHeaders(element);
    // console.log('【tableParser】表格标题:', headers, isValid, extra);
    if (isValid) {
      found = element;
      break;
    }
  }

  if (!found) {
    console.warn(`【tableParser】找不到合法的表格头元素 ${tbodyClass}`);
    return;
  }

  const tbody = found;

  // 获取表格标题
  const { headers, isValid } = getTableHeaders(tbody);
  if (!isValid) {
    console.error('【tableParser】表格标题无效');
    return;
  }

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
      if (index < headers.length) {
        const headerTitle = headers[index];
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
        // console.log('【tableParser】找到分页组件:', pagination);

        // 获取分页信息
        const totalElement = pagination.querySelector('.ant-pagination-total-text');
        if (totalElement) {
          const totalText = totalElement.textContent.trim();
          console.log('【tableParser】分页总数信息:', totalText);
          total = totalText;

          // 可以从文本中提取总记录数，例如 "共 100 条"
          const totalMatch = totalText.match(/共\s*(\d+)\s*条/);
          if (totalMatch && totalMatch[1]) {
            const totalCount = parseInt(totalMatch[1], 10);
            console.log('【tableParser】总记录数:', totalCount);
          }
        }

        // 获取当前页码
        const currentPageElement = pagination.querySelector('.ant-pagination-item-active');
        if (currentPageElement) {
          const currentPage = currentPageElement.textContent.trim();
          console.log('【tableParser】当前页码:', currentPage);
          current = currentPage;
        }

        // 获取下一页按钮
        const nextButton = pagination.querySelector('.ant-pagination-next');
        if (nextButton) {
          console.log('【tableParser】找到下一页按钮:', nextButton);
          next = nextButton;

          // 检查下一页按钮是否禁用
          nextDisabled = nextButton.classList.contains('ant-pagination-disabled');
          console.log('【tableParser】下一页按钮是否禁用:', nextDisabled);

          const pageItems = nextButton.parentElement.querySelectorAll('.ant-pagination-item');
          if (pageItems && pageItems.length > 0) {
            last = pageItems[pageItems.length - 1];
            first = pageItems[0];
            console.log('【tableParser】第一页和最后一页:', first, last);
          }
        } else {
          console.log('【tableParser】未找到下一页按钮');
        }
      } else {
        console.log('【tableParser】未找到分页组件');
      }
    }
  }

  console.log('【tableParser】解析后的表格数据:', tableData);
  return {
    rows,
    tableData,
    total,
    current,
    next,
    nextDisabled,
    last,
    extra
  };
}

function isValidTable(headers) {
  // 检查是否有必要的列
  const requiredColumns = Object.keys(titleToNameMap);
  return requiredColumns.every(col => headers.includes(col));
}