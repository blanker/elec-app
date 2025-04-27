import { setupDynamicContentHandler } from './utils/observers';
import { injectedScript, injectMainCssAndStyle, openIframe } from './utils/domUtils';
import { links } from '../config/menus';
import { setupDynamicNavigationTableHandler } from './services/navigation-table';
import { checkAndClickButton } from "./components/FloatingButton";

// 初始化
function init() {
  // 设置iframeVisible默认值
  chrome.storage.local.set({ iframeVisible: true });

  injectMainCssAndStyle();
  // 注入脚本
  injectedScript('html/iframePage/mock.js');
  const pageScripts = injectedScript('pageScript.js');

  if (pageScripts) {
    pageScripts.addEventListener('load', initializeAjaxTools);
  }

  openIframe();

  // 设置消息监听
  setupMessageListeners();

  // 设置动态内容处理
  const handleDOMReady = () => {
    console.log('【index】handleDOMReady');
    setupDynamicContentHandler();
    // 监控第二页的导航表格变化
    setupDynamicNavigationTableHandler();
    // cleanup();
  };

  if (document.readyState === 'loading') {
    console.log('【index】DOM 尚未加载完成');
    document.addEventListener('DOMContentLoaded', handleDOMReady);
  } else {
    console.log('【index】DOM 已经加载完成');
    handleDOMReady();
  }
}

// 初始化 Ajax 工具
function initializeAjaxTools() {
  chrome.storage.local.get(['iframeVisible', 'ajaxToolsSwitchOn', 'ajaxToolsSwitchOnNot200', 'ajaxDataList', 'ajaxToolsSkin', 'common-storage'], (result) => {
    const { ajaxToolsSwitchOn = true, ajaxToolsSwitchOnNot200 = true } = result;
    const commonStorage = result['common-storage'];

    console.log('【ajaxTools content.js】【storage】', result);
    // 检查是否已有预设规则，如果没有则设置默认规则
    let ajaxDataList = result.ajaxDataList || [];
    if (ajaxDataList.length === 0) {
      // 设置默认的拦截规则
      ajaxDataList = [
        {
          groupName: '默认规则组',
          interfaceList: links.map(link => ({
            open: true,
            request: link,
            matchType: 'normal',
            responseText: `
                let { method, payload, originalResponse } = arguments[0];
                return originalResponse`,
          }))
        }
      ];
    }

    postMessage({ type: 'ajaxTools', to: 'pageScript', key: 'ajaxDataList', value: ajaxDataList });
    postMessage({ type: 'ajaxTools', to: 'pageScript', key: 'ajaxToolsSwitchOn', value: ajaxToolsSwitchOn });
    postMessage({ type: 'ajaxTools', to: 'pageScript', key: 'ajaxToolsSwitchOnNot200', value: ajaxToolsSwitchOnNot200 });
    try {
      postMessage({ type: 'ajaxTools', to: 'background', key: 'commonStorage', value: JSON.parse(commonStorage) });
    } catch (err) {
      console.warn('发送common-storage出错了', err);
    }
  });
}

// 设置消息监听
function setupMessageListeners() {
  // 监听存储变化
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (
        key === 'ajaxDataList'
        || key === 'ajaxToolsSwitchOn'
        || key === 'ajaxToolsSwitchOnNot200'
      ) {
        // 发送到pageScript/index
        postMessage({
          type: 'ajaxTools',
          to: 'pageScript',
          key,
          value: newValue,
        });
      }
    }
  });

  // 监听窗口消息
  window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.type === 'ajaxTools' && data.to === 'background' && data.action === 'sendToBackground') {
      // 将消息转发给 background
      chrome.runtime.sendMessage({
        type: 'ajaxTools',
        key: data.key,
        data: data.data,
        table: data.table,
        extra: data.extra,
      });
    }
  });

  // content-script.js
  /*
  key: 'from-popup',
                action: "popupAction",
                status */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.key === 'from-popup'
      && request.action === 'popupAction') {
      if (request.status === 'GO') {
        checkAndClickButton();
      }
    }
  });
}

// 发送消息
function postMessage(message) {
  window.postMessage(message, '*');
}

// 启动应用
init();