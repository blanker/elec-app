import { getValidMenu } from './domUtils';
import { constants, menus } from '../../config/menus';
import { checkAndInsertMenuButton, checkAndRemoveMenuButton } from '../components/FloatingButton';
import {
  getTableHeaders,
  setCurrentMenu,
  foundMenu,
  menuParent,
  setFoundMenu,
  processing,
  setDefaultMenu,
  setTable,
  currentMenuIndex
} from '../services/tableParser';
import { updateTitleMapByMenuName, getTableName } from '../utils/mappers';
import { process } from '../services/menuService';
import { navigating } from '../services/navigation-select';

let found = false;
export function clearFound() { found = false; }

// 设置动态内容观察器
export function setupDynamicContentHandler() {

  // 创建观察器实例
  let debounceTimer;
  const observer = new MutationObserver((mutationsList) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      observer.disconnect(); // 暂停观察

      // 如果还没找到菜单，尝试查找
      if (!foundMenu) {
        const elements = document.querySelectorAll('.ant-menu');
        for (let element of elements) {
          console.log('【observers】找到根菜单元素:', '.ant-menu');
          const { targetMenu, invalidMenuItem } = getValidMenu(element) ?? {};
          console.log('【observers】找到有效菜单元素:', targetMenu);
          if (targetMenu) {
            // 找到目标菜单，更新状态
            setFoundMenu(targetMenu);
            setDefaultMenu(invalidMenuItem);
            menuParent = element;
            break;
          }
        }
      } else {
        console.log('【observers】已经找到菜单，开始表格');
      }

      // 找到目标菜单后，插入按钮
      if (foundMenu) {
        checkAndInsertMenuButton();
        console.log('【observers】已经找到菜单，开始表格');

        // 更新状态
        const defaultMenu = menus[0];
        setCurrentMenu(defaultMenu);
        setTable(getTableName(defaultMenu.name));
        // 更新标题映射
        updateTitleMapByMenuName(defaultMenu.name);

        setupDynamicTableHandler();
      } else {
        // 继续观察
        observer.observe(document.body, config);
        checkAndRemoveMenuButton();
      }
    }, 300);
  });

  // 配置观察选项
  const config = {
    childList: true,
    subtree: true,
    characterData: true
  };

  // 开始观察
  console.log('【observers】开始观察', document.body); // debug inf
  observer.observe(document.body, config);

  return observer;
}

// 设置表格观察器
export function setupDynamicTableHandler() {
  let debounceTimer;
  const observer = new MutationObserver((mutationsList) => {

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // 检查当前观察的表格是否已被卸载
      if (found && !document.body.contains(found)) {
        console.log('【navigation-table】表格已被卸载，重新开始观察 document.body');
        found = false;
        observer.disconnect();
        observer.observe(document.body, config);
        return;
      }

      if (found) {
        // 已经找到的，不需要再更新了
        return;
      }

      const tbodyClass = constants.tbodyClass;
      const elements = document.querySelectorAll(tbodyClass);
      for (let element of elements) {
        console.log('【observers】找到表格元素:', tbodyClass);

        const { headers, isValid, extra } = getTableHeaders(element);
        console.log('【observers】表格标题:', headers, isValid, extra);
        if (isValid) {
          found = element;
          break;
        }
      }

      if (found) {
        // 只观察当前表
        observer.observe(document.body, config);

        // 找到了，并且处理中，则继续处理数据

        if (navigating && currentMenuIndex === 1) {
          console.log('【observers】切换SELECT中，不做处理', currentMenuIndex)
          console.log('【observers】切换SELECT中，不做处理，并且需要把表格卸载掉', currentMenuIndex)
          found = false;
          return;
        }

        if (processing) {
          console.log('【observers】已经找到表格，继续处理数据', currentMenuIndex);
          setTimeout(() => {
            process();
          }, constants.readyIdle);
          // checkAndRemoveButton();
        } else {
          // checkAndInsertButton();
        }
      } else {
        observer.observe(document.body, config);
        // checkAndRemoveButton();
      }

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