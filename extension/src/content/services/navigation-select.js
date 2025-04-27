import { constants } from '../../config/menus';
import { clickDefaultMenuItem, clickSomeMenuItem } from "./menuService.js";

export let currentSelectIndex = 0;
export let foundSelect = false;
export let selectOptions = [];
export let navigating = false;

export function setupDynamicNavigationSelectHandler() {

}


// 查找页面中的 Select 组件
export const findSelectComponents = () => {
    // antd 的 Select 组件通常有 .ant-select 类
    const selects = document.querySelectorAll('.ant-select');
    for (let element of selects) {
        if (isValidSelect(element)) {
            foundSelect = element;
            return element;
        }
    }

    return false;
};

// 打开 Select 下拉菜单
const openSelectDropdown = (select) => {
    // 找到 Select 的触发元素
    const trigger = select.querySelector('.ant-select-selection');
    if (trigger) {
        // 模拟更完整的用户交互
        // 1. 模拟鼠标按下事件
        trigger.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // 2. 模拟点击事件
        trigger.click();

        // 3. 模拟鼠标抬起事件
        trigger.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        }));

        // 4. 尝试直接设置 Select 的展开状态
        const selectContainer = select.closest('.ant-select');
        if (selectContainer) {
            selectContainer.classList.add('ant-select-open');
        }

        console.log('【navigation-select】已尝试打开下拉菜单');
        return true;
    }
    return false;
};

// 获取 Select 的所有选项
const getSelectOptions = () => {
    // 下拉菜单选项通常在 body 下的 .ant-select-dropdown 中
    const dropdown = document.querySelector(
        '.ant-select-dropdown:not(.ant-select-dropdown-hidden)'
        // '.ant-select-dropdown'
    );
    if (!dropdown) return [];

    // 获取所有选项元素
    const options = dropdown.querySelectorAll('.ant-select-dropdown-menu-item');
    return Array.from(options).map(option => ({
        value: option.getAttribute('title') || option.textContent.trim(),
        element: option
    }));
};

// 选择指定选项
const selectOption = (option) => {
    if (option && option.element) {
        option.element.click();
        return true;
    }
    return false;
};

// 关闭下拉菜单（如果需要）
const closeSelectDropdown = () => {
    // 点击页面其他区域关闭下拉菜单
    document.body.click();
};

const openAndSelectOptions = async () => {
    if (!openSelectDropdown(foundSelect)) {
        console.warn('【navigation-select】无法打开下拉菜单');
        return false;
    }
    // 等待下拉菜单渲染完成
    // 使用Promise
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const options = getSelectOptions();
            console.log('【navigation-select】获取到选项1:', JSON.stringify(options), options);
            resolve(options);
        }, 500);
    });
}


function isValidSelect(select) {
    if (!select) {
        return false;
    }
    const parent = select.parentElement;
    if (!parent) {
        return false;
    }
    const label = parent.querySelector('label');
    if (!label) {
        return false;
    }
    const labelText = label.textContent.trim();
    if (!labelText) {
        return false;
    }
    if (!labelText.match(/邀约选择[:：]/)) {
        return false;
    }
    // 获取当前地址栏
    const currentUrl = window.location.href;
    // 检查当前地址栏是否包含 "ResponseApply-noca"
    if (currentUrl.includes("ResponseApply-noca")) {
        return true;
    }
    return false;
}

export async function isFinished() {
    if (!foundSelect) return true;

    selectOptions = await openAndSelectOptions();
    if (!selectOptions || selectOptions.length === 0) {
        console.log('【navigation-select】没有选项了', currentSelectIndex)
        return true;
    }

    if (currentSelectIndex >= selectOptions.length - 1) {
        console.log('【navigation-select】选项都点过了', currentSelectIndex, selectOptions.length)
        return true;
    }

    // 使用 Promise 来处理延迟返回
    navigating = true;
    return new Promise((resolve) => {
        // 先跳转到一个默认页面
        // 然后再跳回本页面
        // 然后点击第currentRow行，然后继续处理数据
        setTimeout(() => {
            console.log('【navigation-select】1.先点击默认菜单',)
            clickDefaultMenuItem();
        }, 1000);

        setTimeout(() => {
            console.log('【navigation-select】2.再点击下一项菜单',)
            clickSomeMenuItem(0);
        }, 2000);

        setTimeout(() => {
            console.log('【navigation-select】3.点击下一项目',)
            navigateRow();
        }, 6000);

        // 在导航逻辑开始后，设置一个 10 秒的延迟来返回 false
        setTimeout(() => {
            console.log('【navigation-select】10秒后返回 false');
            resolve(false);
        }, 10000); // 10秒延迟
    });
}

async function navigateRow() {
    console.log('【navigation-select isFinished】found', foundSelect, currentSelectIndex);
    if (!foundSelect) {
        setTimeout(() => {
            navigateRow();
        }, 6000);
    } else {
        selectOptions = await openAndSelectOptions();
        if (!selectOptions || selectOptions.length === 0) {
            console.log('【navigation-select】没有选项了', currentSelectIndex)
        }

        console.log('【navigation-select】打开下拉菜单')
        const select = foundSelect;
        if (!openSelectDropdown(select)) {
            console.warn('【navigation-select】无法打开下拉菜单');
        }

        // 等待下拉菜单渲染完成
        console.log('【navigation-select】等待下拉菜单渲染完成')
        setTimeout(() => {
            // const options = getSelectOptions();
            // console.log('【navigation-select】获取到选项3:', options, selectOption);

            currentSelectIndex += 1;
            const targetOption = selectOptions[currentSelectIndex];

            console.log('【navigation-select】准备选择选项', currentSelectIndex, targetOption);

            if (selectOption(targetOption)) {
                console.log(`【navigation-select】已选择选项: ${targetOption.value}`);
            } else {
                console.warn('【navigation-select】选择选项失败');
                closeSelectDropdown();
            }
            navigating = false;
        }, 1500);

    }
}