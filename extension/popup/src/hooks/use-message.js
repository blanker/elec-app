import React, { useEffect, useState } from 'react';

export default function useMessage() {

    const [message, setMessage] = useState(undefined);

    // ... 组件状态和逻辑 ...
    useEffect(() => {
        if (typeof chrome === 'undefined' || !chrome.runtime) return; // 更安全的检查

        const messageListener = (message, sender, sendResponse) => {
            console.log("收到来自 Content Script 或其他部分的的消息:", message); // 调整日志信息
            setMessage(message);
            // 最好根据消息来源或类型决定是否发送响应
            if (sender.tab) { // 消息来自 Content Script
                sendResponse({ confirmation: "Popup 收到来自 Content Script 的消息" });
            } else { // 消息可能来自 Background 或其他 Popup 实例
                sendResponse({ confirmation: "Popup 收到消息" });
            }
            // return true; // 如果 sendResponse 是异步的
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            // 确保 chrome.runtime 仍然存在
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                chrome.runtime.onMessage.removeListener(messageListener);
            }
        };
    }, []);


    // 修改 send 函数，使用 chrome.tabs.sendMessage
    const send = async (status) => { // 允许传递消息内容
        if (typeof chrome === 'undefined' || !chrome.tabs) {
            console.error("Chrome Tabs API 不可用");
            return;
        }

        try {
            // 1. 获取当前活动的标签页
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tabs.length === 0) {
                console.log("没有找到活动的标签页");
                return;
            }
            const activeTab = tabs[0];

            // 确保获取到了 tab ID
            if (!activeTab.id) {
                console.error("无法获取活动标签页的 ID");
                return;
            }

            const messagePayload = {
                key: 'from-popup',
                action: "popupAction",
                status
            };

            // 2. 发送消息到指定标签页的 Content Script
            console.log(`发送消息到 Tab ${activeTab.id}:`, messagePayload);
            chrome.tabs.sendMessage(activeTab.id, messagePayload, (response) => {
                // 处理 lastError
                if (chrome.runtime.lastError) {
                    console.error("发送消息到 Content Script 失败:", chrome.runtime.lastError.message);
                    // 这里可能表示 Content Script 未加载或未监听消息
                } else {
                    console.log("来自 Content Script 的响应:", response);
                }
            });

        } catch (error) {
            console.error("发送消息时出错:", error);
        }
    }

    return {
        message,
        send // 导出 send 函数
    };
}