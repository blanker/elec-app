import { createFloatingButton } from '../utils/domUtils';
import { processMenu } from '../services/menuService';
import { constants } from '../../config/menus';
import { processing, setProcessing } from '../services/tableParser';

// 检查并插入菜单按钮
export function checkAndInsertMenuButton() {
  const btnId = constants.btnId;
  const existingButton = document.getElementById(btnId);

  // 发送消息到 Popup (准备好了)
  chrome.runtime.sendMessage({ action: "ready", status: "ready" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("发送消息到 Popup 失败:", chrome.runtime.lastError.message);
    } else {
      console.log("来自 Popup 的响应:", response);
    }
  });

  if (!existingButton) {

    const button = createFloatingButton(btnId, '点击开始');

    // 添加点击事件
    button.addEventListener('click', () => {
      // const { processing, setProcessing } = useStore.getState();

      if (processing) {
        // 停止处理
        button.textContent = '点击开始';
        button.style.backgroundColor = '#4CAF50';
        setProcessing(false);
      } else {
        // 开始处理
        button.textContent = '点击结束';
        button.style.backgroundColor = '#AF4C50';
        setProcessing(true);

        // 记录点击次数
        chrome.storage.local.get(['clickCount'], (result) => {
          const count = (result.clickCount || 0) + 1;
          chrome.storage.local.set({ clickCount: count });
        });

        // 发送消息到 Popup (处理中)
        chrome.runtime.sendMessage({ action: "processing", status: "processing" }, (response) => {
          if (chrome.runtime.lastError) {
            console.log("发送消息到 Popup 失败:", chrome.runtime.lastError.message);
          } else {
            console.log("来自 Popup 的响应:", response);
          }
        });

        // 开始处理菜单
        processMenu();
      }
    });
  }
}

export function checkAndClickButton() {
  const btnId = constants.btnId;
  const existingButton = document.getElementById(btnId);
  if (existingButton) {
    existingButton.click();
  }
}
export function updateButtonText(text) {
  const btnId = constants.btnId;
  const existingButton = document.getElementById(btnId);
  if (existingButton) {
    existingButton.textContent = text;
  }
}
// 检查并移除菜单按钮
export function checkAndRemoveMenuButton() {
  const btnId = constants.btnId;
  const existingButton = document.getElementById(btnId);

  if (existingButton) {
    existingButton.remove();
  }

  // 发送消息到 Popup (处理中)
  chrome.runtime.sendMessage({ action: "disabled", status: "disabled" }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("发送消息到 Popup 失败:", chrome.runtime.lastError.message);
    } else {
      console.log("来自 Popup 的响应:", response);
    }
  });
}