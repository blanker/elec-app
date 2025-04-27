import { menus } from '../../config/menus';

let isContainerMinimized = false; // 新增：记录容器是否最小化

// 获取有效菜单
export function getValidMenu(menu) {
  try {
    // 查找所有菜单项
    const menuItems = menu.querySelectorAll('.ant-menu-item');
    if (!menuItems || menuItems.length === 0) {
      return null;
    }

    let invalidMenuItem = undefined;
    // 过滤出匹配预定义菜单名称的项
    const validMenus = [];
    Array.from(menuItems)
      .forEach(element => {
        const text = element.textContent.trim();
        const href = element.querySelector('a')?.href;
        // console.log('【getValidMenu】', text, href);
        const menuConfig = menus.find(m =>
          text.includes(m.name) && href.includes(m.urlPattern)
        );

        if (text.includes('交易主体信息') || href.includes('/console/daily-demand-market/Dashboard')) {
          invalidMenuItem = element;
        }

        if (menuConfig) {
          validMenus.push({
            ...menuConfig,
            element,
            text,
            href,
          });
        } else if (!invalidMenuItem) {
          invalidMenuItem = element;
        }
      });
    console.log('【getValidMenu】有效菜单', validMenus);
    console.log('【getValidMenu】默认的非有效菜单', invalidMenuItem);

    return validMenus.length > 0 ? { targetMenu: validMenus, invalidMenuItem } : null;
  } catch (e) {
    console.error('获取有效菜单出错:', e);
    return null;
  }
}

// 创建浮动按钮
export function createFloatingButton(id, text, position = {}) {
  const existingButton = document.getElementById(id);
  if (existingButton) {
    return existingButton;
  }

  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.style.position = 'fixed';
  button.style.zIndex = '9999';
  button.style.bottom = position.bottom || '20px';
  button.style.right = position.right || '20px';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.opacity = '0'; // 设置为完全透明
  button.style.pointerEvents = 'none'; // 阻止鼠标事件

  document.body.appendChild(button);
  return button;
}

// 注入脚本
export function injectedScript(path) {
  // 只在最顶层嵌入
  if (window.self === window.top) {
    const scriptNode = document.createElement('script');
    scriptNode.src = chrome.runtime.getURL(path);
    document.documentElement.appendChild(scriptNode);
    return scriptNode;
  }
}

function injectedCss(path) {
  if (window.self === window.top) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = chrome.runtime.getURL(path);
    document.documentElement.appendChild(linkElement);
    return linkElement;
  }
}
function injectedStyle(styleContent) {
  if (window.self === window.top) {
    const styleElement = document.createElement('style');
    styleElement.textContent = styleContent;
    document.documentElement.appendChild(styleElement);
    return styleElement;
  }
}

export function injectMainCssAndStyle() {
  injectedStyle(`
  .ajax-interceptor-container {
    display: flex;
    flex-direction: column;
    height: 100% !important;
    width: 322px !important;
    min-width: 1px !important;
    position: fixed !important;
    top: 0px !important;
    right: 0px !important;
    z-index: 2147483647 !important;
    transition: all 0.4s ease 0s !important;
    /* 加强阴影 */
    box-shadow: 0 0 32px 8px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.18) !important;
    /* 半透明白色背景+毛玻璃 */
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    /* 圆角和边框 */
    border-radius: 12px 0 0 12px;
    border-left: 2px solid #e0e0e0;
    overflow: hidden;
  }
  .ajax-interceptor-action-bar {
    height: 40px;
    min-height: 40px;
    padding: 0 12px 0 8px;
    display: flex;
    justify-content: space-between; /* Keep space-between for now */
    align-items: center;
  }
  .ajax-interceptor-iframe {
    border: none;
    height: calc(100% - 48px);
    width: 100%;
    border-top: 1px solid #d1d3d8;
  }
  .ajax-interceptor-icon {
    cursor: pointer;
    position: relative;
  }
  .ajax-interceptor-new::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff0000;
    position: absolute;
    right: -2px;
    top: -2px;
  }
  .ajax-interceptor-mr-8 {
    margin-right: 8px;
  }
  /* 新增拖动句柄样式 */
  .ajax-interceptor-drag-handle {
    display: flex;
    flex-grow: 1;
    height: 18px;
    cursor: move;
    margin: 0 10px;
    min-width: 20px;
    /* 使用内联 SVG 作为背景 */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='18' viewBox='0 0 100 18'%3E%3Cline x1='0' y1='4' x2='100' y2='4' stroke='%23aaa' stroke-width='2'/%3E%3Cline x1='0' y1='9' x2='100' y2='9' stroke='%23aaa' stroke-width='2'/%3E%3Cline x1='0' y1='14' x2='100' y2='14' stroke='%23aaa' stroke-width='2'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 18px;
  }
  /* 移除原来的 span 样式，因为不再需要 */
  /* .ajax-interceptor-drag-handle span {
    display: block;
    width: 10px;
    height: 2px;
    background-color: #aaa;
    margin-bottom: 3px;
  }
  .ajax-interceptor-drag-handle span:last-child {
    margin-bottom: 0;
  } */
`);
  injectedCss('icons/iconfont/iconfont.css');
}

export function openIframe() {
  // 只在最顶层页面嵌入iframe
  if (window.self === window.top) {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {

        let container = document.createElement('div');
        container.className = 'ajax-interceptor-container';
        // 初始隐藏状态，可以设置 left 为屏幕宽度
        container.style.left = `${window.innerWidth}px`;
        // container.style.setProperty('transform', 'translateX(calc(100% + 20px))', 'important'); // 移除 transform 控制
        const { header: _actionBar, zoomBtn } = actionBar(container);
        container.appendChild(_actionBar);
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL("popup/index.html?source=iframe");
        iframe.className = 'ajax-interceptor-iframe';
        container.appendChild(iframe);
        if (document.body) {
          document.body.appendChild(container);
        }
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          // console.log('【content】【ajax-tools-iframe-show】receive message', request);
          const { type, iframeVisible } = request;
          if (type === 'iframeToggle') {
            // 通过修改 left 来控制显示/隐藏
            const targetLeft = iframeVisible ? window.innerWidth - container.offsetWidth : window.innerWidth;
            container.style.left = `${targetLeft}px`;
            // container.style.setProperty('transform', iframeVisible ? 'translateX(0)' : 'translateX(calc(100% + 20px))', 'important'); // 移除 transform 控制
            sendResponse({ nextIframeVisible: !iframeVisible });
          }
          return true;
        });

        // 初始显示动画
        setTimeout(() => {
          // zoomBtn.click(); // 缩小
          setTimeout(() => {
            // 显示动画：将 left 设置到屏幕内
            const initialVisibleLeft = window.innerWidth - container.offsetWidth; // 假设初始显示在最右侧
            container.style.left = `${initialVisibleLeft}px`;
            // container.style.setProperty(
            //   'transform',
            //   true
            //     ? 'translateX(0)'
            //     : 'translateX(calc(100% + 20px))', 'important'
            // ); // 移除 transform 控制
          }, 300);
        }, 100);

      }
    }

  }
}
// 新增：封装拖动逻辑的函数
function setupDragAndDrop(handleElement, containerElement) {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  handleElement.addEventListener('mousedown', (e) => {
    // 不再需要检查 e.target === header，因为事件监听器直接在 handle 上
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡到 header 或其他元素

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const computedStyle = window.getComputedStyle(containerElement);
    initialTop = parseFloat(computedStyle.top) || 0;
    const initialRight = parseFloat(computedStyle.right) || 0;
    initialLeft = window.innerWidth - initialRight - containerElement.offsetWidth;

    // 设置初始样式，确保使用 left/top 定位
    containerElement.style.setProperty('top', `${initialTop}px`, 'important');
    // containerElement.style.setProperty('left', `${initialLeft}px`, 'important');
    containerElement.style.setProperty('left', `auto`, 'important');
    containerElement.style.setProperty('right', '0px', 'important');
    containerElement.style.setProperty('bottom', 'auto', 'important');

    containerElement.style.setProperty('transition', 'none', 'important');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });

  function handleMouseMove(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    const currentOffsetWidth = containerElement.offsetWidth;
    const maxLeft = window.innerWidth - currentOffsetWidth;
    const maxTop = window.innerHeight - containerElement.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    containerElement.style.setProperty('top', `${newTop}px`, "important");
    // containerElement.style.setProperty('left', `${newLeft}px`, "important");
    containerElement.style.setProperty('left', `auto`, "important");
  }

  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    containerElement.style.setProperty('transition', `all 0.4s ease 0s`, "important");
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}

function actionBar(container) {
  const header = document.createElement('header');
  header.className = 'ajax-interceptor-action-bar';
  // header.style.cursor = 'move'; // 移除这里的 cursor 设置

  // --- 移除旧的拖动逻辑 ---
  // let isDragging = false;
  // let startX, startY, initialLeft, initialTop;
  // header.addEventListener('mousedown', ...);
  // function handleMouseMove(e) { ... }
  // function handleMouseUp() { ... }
  // --- 移除结束 ---

  // left 容器
  const left = document.createElement('div');
  left.style.display = 'flex'; // 让内部图标水平排列
  left.style.alignItems = 'center';
  left.style.justifyContent = 'center'; // 让内部图标靠左对齐

  // const closeBtn = closeButton(container);
  // left.appendChild(closeBtn);

  const zoomBtn = zoomButton(container);
  left.appendChild(zoomBtn);
  header.appendChild(left);

  // 创建并添加拖动句柄
  // 创建并添加拖动句柄
  const dragHandle = document.createElement('div');
  dragHandle.className = 'ajax-interceptor-drag-handle';
  // 不再需要创建 span 元素
  // for (let i = 0; i < 3; i++) {
  //   const dot = document.createElement('span');
  //   dragHandle.appendChild(dot);
  // }
  header.appendChild(dragHandle);

  // right 容器
  const right = document.createElement('div');
  left.style.display = 'flex'; // 让内部图标水平排列
  left.style.alignItems = 'center';
  left.style.justifyContent = 'center'; // 让内部图标靠左对齐
  const themeModeBtn = themeModeButton(container);
  right.appendChild(themeModeBtn);
  header.appendChild(right);

  // --- 新增：调用新的拖动设置函数 ---
  setupDragAndDrop(dragHandle, container);
  // --- 调用结束 ---

  return {
    header, zoomBtn
  };
}


function closeButton(container) {
  const closeIcon = document.createElement('i');
  closeIcon.title = 'Close';
  closeIcon.className = 'c-iconfont c-icon-close ajax-interceptor-icon';
  closeIcon.addEventListener('click', function () {
    container.style.setProperty('transform', 'translateX(calc(100% + 20px))', 'important');
    chrome.storage.local.set({ iframeVisible: true });
  })
  return closeIcon;
}
function zoomButton(container) {
  let zoomOut = true; // 初始是放大状态 (显示完整内容)
  const zoomIcon = document.createElement('i');
  // 初始状态是放大，显示缩小的图标
  zoomIcon.className = 'c-iconfont c-icon-reduce ajax-interceptor-icon';
  zoomIcon.title = 'Zoom out'; // 初始提示是缩小

  // 注意：openIframe 中的 setTimeout 会立即点击一次，所以实际初始状态会变成 zoomOut = false (最小化)
  // isContainerMinimized 也会随之变为 true

  zoomIcon.addEventListener('click', function () {
    if (zoomOut) { // 当前是放大状态，点击后执行缩小
      container.style.setProperty('height', '40px', 'important');
      container.style.setProperty('right', '0px', 'important');
      container.style.setProperty('left', 'auto', 'important');
      let timer = setTimeout(() => {
        container.style.setProperty('width', '120px', 'important');
        clearTimeout(timer);
      }, 400);
      zoomOut = false;
      isContainerMinimized = true;
      zoomIcon.title = 'Zoom in';
      zoomIcon.className = 'c-iconfont c-icon-fullscreen ajax-interceptor-icon';
    } else { // 当前是缩小状态，点击后执行放大
      const newWidth = 322; // 目标宽度
      container.style.setProperty('width', `${newWidth}px`, 'important');
      container.style.setProperty('top', `0`, 'important');
      let timer = setTimeout(() => {
        container.style.setProperty('height', '100%', 'important');
        clearTimeout(timer);
      }, 400);
      zoomOut = true;
      isContainerMinimized = false;
      zoomIcon.title = 'Zoom out';
      zoomIcon.className = 'c-iconfont c-icon-reduce ajax-interceptor-icon';

      // --- 新增：检查并调整位置 ---
      const computedStyle = window.getComputedStyle(container);
      let currentLeft = parseFloat(computedStyle.left);
      // 如果 left 是 'auto' 或 NaN (可能由 inset 或 right 控制)，尝试从 inset 获取
      if (isNaN(currentLeft) && computedStyle.inset) {
        const insetParts = computedStyle.inset.split(' ');
        if (insetParts.length === 4 && insetParts[3] !== 'auto') {
          currentLeft = parseFloat(insetParts[3]);
        } else if (computedStyle.right !== 'auto') {
          // 如果 inset 没提供 left，尝试用 right 计算
          currentLeft = window.innerWidth - parseFloat(computedStyle.right) - newWidth;
        } else {
          // 如果都无法获取，给一个默认值或记录错误
          console.warn("无法确定当前的 left 值，位置可能不准确");
          currentLeft = 0; // 或者其他安全默认值
        }
      }


      const maxLeft = window.innerWidth - newWidth;
      if (currentLeft > maxLeft) {
        const currentTop = parseFloat(computedStyle.top) || 0; // 保留当前的 top 值
        console.log(`【ZoomButton】放大超出右边界，调整 left 从 ${currentLeft} 到 ${maxLeft}`);
        // container.style.setProperty('inset', `${currentTop}px auto auto ${maxLeft}px`, "important");
        // container.style.setProperty('left', `${maxLeft}px`, "important");
      }
      // --- 调整位置结束 ---
    }
    console.log('Container minimized state:', isContainerMinimized);
  })
  return zoomIcon;
}
function pipButton(container) {
  const pipIcon = document.createElement('i');
  pipIcon.title = 'Picture in picture';
  const className = 'c-iconfont c-icon-zoomout ajax-interceptor-icon';
  pipIcon.className = className;
  chrome.storage.local.get(['ajaxToolsPipBtnNewHideFlag'], ({ ajaxToolsPipBtnNewHideFlag }) => {
    pipIcon.className = ajaxToolsPipBtnNewHideFlag ? pipIcon.className : `${pipIcon.className} ajax-interceptor-new`;
  });
  pipIcon.addEventListener('click', async function () {
    if (!('documentPictureInPicture' in window)) {
      alert('Your browser does not currently support documentPictureInPicture. You can go to chrome://flags/#document-picture-in-picture-api to enable it.\n' +
        'If you have enabled documentPictureInPicture, please use the HTTPS protocol, or localhost/127.0.0.1, or open the configuration page in a new tab and use picture-in-picture there.');
      return;
    }
    pipIcon.className = className;
    chrome.storage.local.set({ ajaxToolsPipBtnNewHideFlag: true });
    const iframe = document.querySelector('.ajax-interceptor-iframe');
    const pipWindow = await documentPictureInPicture.requestWindow({ width: 322, height: 800 });
    // css
    const allCSS = [...document.styleSheets]
      .map((styleSheet) => {
        try {
          return [...styleSheet.cssRules].map((r) => r.cssText).join('');
        } catch (e) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      })
      .filter(Boolean)
      .join('\n');
    const style = document.createElement('style');
    style.textContent = allCSS;
    pipWindow.document.head.appendChild(style);
    // js
    [...document.scripts].map((v) => {
      const script = document.createElement('script');
      script.src = v.src;
      script.type = v.type;
      pipWindow.document.head.appendChild(script);
    });
    pipWindow.document.body.append(iframe);
    // 收起侧边
    container.style.setProperty('transform', 'translateX(calc(100% + 20px))', 'important');
    iframe.style.setProperty('height', '100%');
    pipWindow.addEventListener('pagehide', (event) => {
      // 展示侧边
      container.style.setProperty('transform', 'translateX(0)', 'important');
      iframe.style.setProperty('height', 'calc(100% - 40px)');
      container?.append(iframe);
    });
  });
  return pipIcon;
}
function themeModeButton(container) {
  let mode = 'light'; // 'light|dark'
  const themeIcon = document.createElement('i');
  themeIcon.addEventListener('click', function () {
    if (mode === 'dark') {
      mode = 'light';
      themeIcon.title = 'Dark';
      themeIcon.className = 'c-iconfont c-icon-heiyemoshi ajax-interceptor-icon';
      container.style.setProperty('filter', 'none');
      chrome.storage.local.set({ ajaxToolsSkin: 'light' });
    } else {
      mode = 'dark';
      themeIcon.title = 'Light';
      themeIcon.className = 'c-iconfont c-icon-taiyang ajax-interceptor-icon';
      container.style.setProperty('filter', 'invert(1)');
      chrome.storage.local.set({ ajaxToolsSkin: 'dark' });
    }
  });
  // 设置初始主题
  chrome.storage.local.get(['ajaxToolsSkin'], (result) => {
    mode = result.ajaxToolsSkin || 'light';
    if (mode === 'dark') {
      themeIcon.title = 'Light';
      themeIcon.className = 'c-iconfont c-icon-taiyang ajax-interceptor-icon';
      container.style.setProperty('filter', 'invert(1)');
    } else {
      themeIcon.title = 'Dark';
      themeIcon.className = 'c-iconfont c-icon-heiyemoshi ajax-interceptor-icon';
      container.style.setProperty('filter', 'none');
    }
  });
  return themeIcon;
}
function discussionsButton() {
  const discussionsIcon = document.createElement('i');
  discussionsIcon.title = 'Discussions';
  discussionsIcon.className = 'c-iconfont c-icon-xiaoxi ajax-interceptor-icon';
  discussionsIcon.addEventListener('click', function () {
    window.open('https://github.com/PengChen96/ajax-tools/discussions');
  })
  return discussionsIcon;
}
function codeNetButton() {
  const codeNetIcon = document.createElement('i');
  codeNetIcon.title = 'Open the Declarative Network Request Configuration page';
  const className = 'c-iconfont c-icon-code ajax-interceptor-icon';
  codeNetIcon.className = className;
  chrome.storage.local.get(['ajaxToolsCodeNetBtnNewHideFlag'], ({ ajaxToolsCodeNetBtnNewHideFlag }) => {
    codeNetIcon.className = ajaxToolsCodeNetBtnNewHideFlag ? className : `${className} ajax-interceptor-new`;
  });
  codeNetIcon.addEventListener('click', function () {
    window.open(chrome.runtime.getURL('html/iframePage/dist/declarativeNetRequest.html'));
    codeNetIcon.className = className;
    chrome.storage.local.set({ ajaxToolsCodeNetBtnNewHideFlag: true });
  })
  return codeNetIcon;
}
function newTabButton() {
  const newTabIcon = document.createElement('i');
  newTabIcon.title = 'Open a new tab';
  newTabIcon.className = 'c-iconfont c-icon-codelibrary ajax-interceptor-icon';
  newTabIcon.addEventListener('click', function () {
    window.open(chrome.runtime.getURL('popup/index.html'));
  })
  return newTabIcon;
}