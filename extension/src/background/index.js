let commonStorage = null;
let creditCode = null;
let creditName = null;
// "data": {
//   "creditCode": "91440101MA5D693M4Q",
//   "id": "33530154",
//   "name": "广东万嘉售电有限公司"
// },
function sendMessageToContentScript(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      // console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', response);
      resolve(response);
    });
  });
}
async function toggleIframeVisibility() {
  const { iframeVisible } = await chrome.storage.local.get({ iframeVisible: true });
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await sendMessageToContentScript(tabs[0].id, { type: 'iframeToggle', iframeVisible });
  await chrome.storage.local.set({ iframeVisible: response.nextIframeVisible });
}
function setSwitchBadge(switchValue) {
  chrome.action.setBadgeText({ text: switchValue ? 'ON' : 'OFF' });
  chrome.action.setBadgeTextColor({ color: switchValue ? '#ffffff' : '#333333' });
  chrome.action.setBadgeBackgroundColor({ color: switchValue ? '#4480f7' : '#bfbfbf' });
}

chrome.action.onClicked.addListener(async () => {
  await toggleIframeVisibility();
});

chrome.storage.local.get(['ajaxToolsSwitchOn'], (result) => {
  const { ajaxToolsSwitchOn = true } = result;
  setSwitchBadge(ajaxToolsSwitchOn);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'ajaxToolsSwitchOn') {
      setSwitchBadge(newValue);
    }

    if (key === 'common-storage') {
      console.log('【【【【 background 】】】】 common-storage: ', newValue);
      try {
        commonStorage = JSON.parse(newValue);
        console.log("【【【【 background 】】】】 common-storage:", commonStorage);
      } catch (err) {
        console.warn("", newValue);
      }
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('%c Ajax Tools onInstalled', `color: #3aa757`);
});

const host = 'http://elec.blanker.cc';
// const host = 'http://localhost:4173';
// 添加消息监听器处理来自 content script 的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.key === 'response') {
    const { responseText, args, toJson, extra } = message.data;
    // 在这里处理 args 数据
    console.log('Background 收到Response数据:', {
      responseText,
      args,
      toJson,
      url: sender.url,
      tabId: sender.tab.id,
      extra,
    });

    // 可以在这里进行更复杂的处理，比如记录到数据库、发送到服务器等
    try {
      const resp = JSON.parse(args.originalResponse);
      console.log('origional response:', resp);
      if (!resp.data) { return; }
      let url = `${host}/api/table-hall/`;
      if (args?.requestUrl?.includes('getDeclareReferenceInfo')) {
        url = `${host}/api/table-data/daily-demand-market/`;
      } else if (args?.requestUrl?.includes('getBuResponseCapByAccountIdAndListId')) {
        url = `${host}/api/table-data/bu-response-cap/`;
      } else if (args?.requestUrl?.includes('getSettleMonthTotal')) {
        url = `${host}/api/table-data/settlement/`;
      } else if (args?.requestUrl?.includes('/resmktapply-service/index/getLaInfo/access')) {
        url = `${host}/api/table-data/customer/`;
        // "data": {
        //   "creditCode": "91440101MA5D693M4Q",
        //   "id": "33530154",
        //   "name": "广东万嘉售电有限公司"
        // },
        console.log("【【【 background 】】】客户信息获取", resp);
        if (resp?.data?.creditCode) creditCode = resp?.data?.creditCode;
        if (resp?.data?.name) creditName = resp?.data?.name;
      }


      // common-storage
      getTenantId().then(tenant_id => {
        if (!tenant_id) {
          console.warn('【background】没有租户，不能发送数据');
        } else {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: resp.data,
              timestamp: resp.timestamp,
              extra,
              tenant: tenant_id,
              tenant_name: creditName,
            }),
          }).then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

    } catch (error) {
      console.error('Error:', error);
    }
    // 返回处理结果
    // sendResponse({
    //     success: true,
    //     message: '数据已在 background 处理',
    //     processedAt: new Date().toISOString()
    // });

    return true; // 保持消息通道开放，以便异步响应
  } else if (message.key === 'table') {
    const { data, table, extra } = message;
    // 在这里处理 args 数据
    console.log('Background 收到Table数据:', {
      data,
      table,
      extra,
      url: sender.url,
      tabId: sender.tab.id
    });

    try {
      const url = `${host}/api/table-data/${table ?? 'table-device'}/`;
      console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', url, data);
      getTenantId().then(tenant_id => {
        if (!tenant_id) {
          console.warn('【background】没有租户，不能发送数据');
        } else {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data,
              tenant: tenant_id,
              tenant_name: creditName,
            }),
          }).then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });

    } catch (error) {
      console.error('Error:', error);
    }

    // 可以在这里进行更复杂的处理，比如记录到数据库、发送到服务器等

    // 返回处理结果
    // sendResponse({
    //     success: true,
    //     message: '数据已在 background 处理',
    //     processedAt: new Date().toISOString()
    // });

    return true; // 保持消息通道开放，以便异步响应
  } else if (message.to === 'background' && message.key === 'commonStorage') {
    console.log('【【【【background】】】】收到初始化数据 - common-storage', message)
    commonStorage = message.value;
    console.log('【【【【background】】】】收到初始化数据 - common-storage', commonStorage)

  }
  return true;
});

async function getTenantId() {
  if (creditCode) {
    console.log('【【【 background 】】】 getTenantId CREDIT CODE', creditCode, creditName);
    return creditCode;
  }
  if (commonStorage?.state?.user?.tenant_id) {
    console.log("【background】getTenantId 内存中", commonStorage?.state?.user?.tenant_id);
    return commonStorage?.state?.user?.tenant_id;
  }
  console.log('【background】getTenantId BEGIN');
  const result = await chrome.storage.local.get(['common-storage']);
  console.log('【background】getTenantId result', result)
  if (!result) return null;
  const thisCommonStorage = result['common-storage'];
  console.log('【background】getTenantId thisCommonStorage', thisCommonStorage)
  if (!thisCommonStorage) return null;
  if (typeof (thisCommonStorage) !== 'string') return null;

  try {
    const { state } = JSON.parse(thisCommonStorage);
    if (!state?.user?.tenant_id) {
      console.warn("【background】没有租户数据", state, thisCommonStorage);
      return null;
    }
    commonStorage = thisCommonStorage;
    return state?.user?.tenant_id;
  } catch (err) {
    return null;
  }
}

