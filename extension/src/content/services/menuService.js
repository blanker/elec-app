import { updateTitleMapByMenuName, getTableName } from '../utils/mappers';
import { setupDynamicTableHandler } from '../utils/observers';
import {
  parseTableData,
  setCurrentMenu,
  foundMenu,
  defaultMenuItem,
  currentMenuIndex,
  table,
  processing,
  setProcessing,
  setTable,
  resetState,
  nextMenu,
} from './tableParser';
import { constants, test } from '../../config/menus';
import { isFinished } from './navigation-table'
import { isFinished as isFinishedSelect } from './navigation-select'
import { updateButtonText } from '../components/FloatingButton'
import { clearFound } from "../utils/observers";
import { pageCount } from './detail-table';

export function clickDefaultMenuItem() {
  // 找到默认菜单元素下的<a>节点，并且获取href
  console.log('【menuService】点击默认菜单项')
  console.log('【menuService】点击默认菜单项1', JSON.stringify(foundMenu))
  console.log('【menuService】点击默认菜单项2', JSON.stringify(defaultMenuItem), defaultMenuItem)
  const defaultLinkElement = defaultMenuItem?.querySelector('a');
  if (defaultLinkElement && defaultLinkElement.href) {
    const href = defaultLinkElement.getAttribute('href');
    console.log(`【clickDefaultMenuItem】准备导航到链接: ${href}`);
    // 使用window.location导航到该链接
    // 使用history API而不是直接改变location
    if (href.startsWith('#')) {
      // 如果是hash路由
      history.pushState(null, '', href);
      // 触发hashchange事件
      window.dispatchEvent(new Event('hashchange'));
    } else {
      // 如果是普通链接，仍然使用location
      window.location.href = href;
    }
  }
}

export function clickSomeMenuItem(index) {
  // 获取到菜单元素下的<a>节点
  const linkElement = Array.from(foundMenu)[index].element.querySelector('a');
  if (linkElement && linkElement.href) {
    const href = linkElement.getAttribute('href');
    console.log(`【clickSomeMenuItem】准备导航到链接: ${href}`);
    // 使用window.location导航到该链接
    // 使用history API而不是直接改变location
    if (href.startsWith('#')) {
      // 如果是hash路由
      history.pushState(null, '', href);
      // 触发hashchange事件
      window.dispatchEvent(new Event('hashchange'));
    } else {
      // 如果是普通链接，仍然使用location
      window.location.href = href;
    }
  }
}

// 处理菜单
export function processMenu() {
  try {

    if (!foundMenu || !processing) {
      return;
    }

    // 刚开始准备处理
    if (currentMenuIndex === 0) {
      processing = false;
      setTimeout(() => {
        clickDefaultMenuItem();
      }, 100);
      setTimeout(() => {
        clickSomeMenuItem(0);
        processing = true;
        // 获取到菜单元素下的<a>节点
        const linkElement = Array.from(foundMenu)[0].element.querySelector('a');
        if (linkElement && linkElement.href) {
          const href = linkElement.getAttribute('href');
          console.log(`【menuService】准备导航到链接: ${href}`);
          // href = '#/console/daily-demand-market/ResponseApply-noca?s1745063293894'
          // 取出href中的#/console/daily-demand-market/ResponseApply-noca
          // 并且去掉?后边的部分
          const hrefWithoutQuery = href.split('?')[0];
          // console.log(`【menuService】处理后的链接: ${hrefWithoutQuery}`);
          const hrefWithoutHash = hrefWithoutQuery.replace('#', '');
          // console.log(`【menuService】处理后的链接: ${hrefWithoutHash}`);
          // 获取当前的地址栏地址
          const currentUrl = window.location.href;
          // console.log(`【menuService】当前地址栏地址: ${currentUrl}`);
          if (currentUrl.includes(hrefWithoutHash)) {
            setTimeout(() => {
              clickDefaultMenuItem();
            }, 500);
          }
        }
        // 真正进入第一个菜单
        setTimeout(() => {
          clickSomeMenuItem(0);
        }, 1000);
        nextMenu();
      }, 200)

      return;
    }

    const menus = Array.from(foundMenu);
    if (currentMenuIndex < menus.length) {
      if (currentMenuIndex === 1) {
        // 判断第一个菜单是否已经处理了所有行数据
        isFinishedSelect()
          .then(result => {
            // 处理完成了，才进入第二个菜单
            if (result) {
              gotoNextMenu(menus);
            } else {
              // 没处理完，则需要等着系统自动切换菜单->选择下一个选项
              // 然后10s后才继续处理行
              // 

            }
          });
      } else if (currentMenuIndex === 2) {
        gotoNextMenu(menus)
      } else if (currentMenuIndex === 3) {
        // 判断第三个菜单是否已经处理了所有行数据
        if (isFinished()) {
          gotoNextMenu(menus)
        }
      }


    } else {
      // 判断第三个菜单是否已经处理了所有行数据
      if (isFinished()) {
        // 所有菜单都已处理，重置状态
        resetState();
        // 完成处理
        complete('完成');
      }
    }
  } catch (e) {
    console.error('【menuService】processMenu error', e);
  }
}

function gotoNextMenu(menus) {
  // 获取当前菜单元素
  const menuItem = menus[currentMenuIndex];
  console.log(`【menuService】处理菜单元素 ${currentMenuIndex + 1}:`, menuItem.name, menuItem.table);

  // 更新状态
  setCurrentMenu(menuItem);
  setTable(getTableName(menuItem.name));
  // 更新标题映射
  updateTitleMapByMenuName(menuItem.name);
  // 设置表格观察器
  // setupDynamicTableHandler();

  // 查找菜单元素下的<a>节点
  const linkElement = menuItem.element.querySelector('a');
  if (linkElement && linkElement.href) {
    // 获取链接地址并导航
    const href = linkElement.getAttribute('href');
    console.log(`【menuService】导航到链接: ${href}`);

    // 使用window.location导航到该链接
    // 使用history API而不是直接改变location
    if (href.startsWith('#')) {
      // 如果是hash路由
      history.pushState(null, '', href);
      // 触发hashchange事件
      window.dispatchEvent(new Event('hashchange'));
    } else {
      // 如果是普通链接，仍然使用location
      window.location.href = href;
    }
  }

  // 更新菜单索引
  nextMenu();
}


// 处理表格数据
let pageProcessing = false;
let testing = false;
function setPageProccessing(processing) {
  pageProcessing = processing;
}
export function process() {
  console.log('【menuService】process pageProcessing', pageProcessing);
  try {
    if (pageProcessing) {
      // console.log('【menuService】pageProcessing', pageProcessing);
      return;
    } else {
      if (currentMenuIndex === 2) {
        console.log('【【【process】】】第二个菜单开始处理，准备执行处理逻辑');
      }
    }
    setPageProccessing(true);

    const result = parseTableData();
    console.log('【menuService】parseTableData result', result);
    if (!result) {
      console.log('【menuService】没有获取表格数据，进入下一个菜单');
      setTimeout(() => {
        setPageProccessing(false);
        processMenu();
      }, 1000);
      return;
    }
    const { rows, tableData, total, current, next, nextDisabled, last, first, extra } = result;

    if (tableData && Array.isArray(tableData) && tableData.length > 0) {
      // 发送表格数据
      try {
        window.postMessage({
          type: 'ajaxTools',
          to: 'background',
          action: 'sendToBackground',
          key: 'table',
          table: table,
          data: tableData,
          extra,
        }, '*');
      } catch (e) {
        console.error('【menuService】发送数据到 background 失败:', e);
      }
      console.log('【menuService】发送表格数据', current, total, tableData);
    } else {
      console.log('【menuService】没有数据了，进入下一个菜单');
      setTimeout(() => {
        setPageProccessing(false);
        processMenu();
      }, 1000);
      return;
    }

    // 测试用
    if (testing) {
      testing = false;
      console.log('【menuService】测试用', '直接进入下一个菜单');
      setTimeout(() => {
        processMenu();
        setPageProccessing(false);
      }, 1000);
      return;
    }


    // 点击每一行
    let timeout = 0;
    rows.forEach((row, index) => {
      timeout += constants.nextRowInterval;
      console.log(`【menuService】[${currentMenuIndex}]点击下一行【${index + 1}】间隔时间是:  ${timeout}`, timeout);
      // 结算数据
      if (currentMenuIndex === 2) {
        if (pageCount > 0) {
          // 每一行要增加(n-1)*1000毫秒
          timeout += (pageCount - 1) * 1000;
          console.log(`【menuService】结算数据间隔时间是:  ${timeout}`, timeout);
        }
      }
      setTimeout(() => {
        console.log('【menuService】点击下一行', index);
        row.click();
      }, timeout);
    });

    const nextTimeout = constants.nextPageInterval + timeout
    console.log(`【menuService】点击下一页/下一个菜单间隔时间是: ${constants.nextPageInterval} + ${timeout}`, nextTimeout);
    // 点击下一页
    if (next && !nextDisabled) {
      // 点击下一页的间隔时间
      setTimeout(() => {
        console.log('【menuService】点击下一页，本页处理完成');
        // 测试，点最后一页
        clearFound();
        if (test) {
          last.click();
        } else {
          next.click();
        }

        setPageProccessing(false);
      }, nextTimeout);
    } else {
      // 判断是否可以进入下一个菜单
      console.log('【menuService】没有下一页了，进入下一个菜单，本页处理完成');
      setTimeout(() => {
        processMenu();
        setPageProccessing(false);
      }, nextTimeout);
    }
  } catch (e) {
    complete('出错了');
    console.error('【menuService】process error', e);
    setProcessing(false);
    setPageProccessing(false);
  }
}

// 完成处理
export function complete(message) {
  console.log(message);
  updateButtonText(message);
  // 可以添加其他完成处理的逻辑
}