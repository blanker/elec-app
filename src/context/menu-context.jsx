import React, { useEffect, createContext, useContext, useState } from "react";
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

const MenuContext = createContext({});

function parseHashRoute() {
    // 获取完整的 hash（包括 # 符号）
    const fullHash = window.location.hash;
    console.log('完整的 hash:', fullHash); // 例如: "#/declaration"
    // 获取 hash 值（不包括 # 符号）
    const hashValue = window.location.hash.substring(1);
    console.log('hash 值:', hashValue);
    // 分离路径和查询参数
    const [path, queryString] = hashValue.split('?');
    // 解析查询参数
    const queryParams = {};
    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            queryParams[key] = decodeURIComponent(value || '');
        });
    }
    return {
        path,
        queryParams
    };
}

export function MenuProvider({ children }) {
    const [currentMenu, setCurrentMenu] = useState(null);

    useEffect(() => {
        // 使用示例
        const { path, queryParams } = parseHashRoute();
        console.log('路径:', path);
        console.log('查询参数:', queryParams);

        if (path && !currentMenu) {
            const target = menus.find(item => item.url === path);
            if (target) {
                setCurrentMenu(target.key);
            }
        }

    }, [])

    return (
        <MenuContext.Provider value={{
            currentMenu,
            setCurrentMenu,
            menus
        }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenuContext() {
    return useContext(MenuContext);
}

const menus = [
    {
        section: 'main',
        key: 'home',
        title: "首页",
        url: "/",
        icon: IconDashboard,
    },
    {
        section: 'main',
        key: 'declaration', // isActiv
        title: "需求响应申报",
        url: "/declaration",
        icon: IconListDetails,
    },
    {
        section: 'main',
        key: 'response',
        title: "响应评估结果公示",
        url: "/response",
        icon: IconChartBar,
    },
    {
        section: 'main',
        key: 'settlement',
        title: "月结算报表",
        url: "/settlement",
        icon: IconFolder,
    },
    {
        section: 'main',
        key: 'settlement-detail',
        title: "月结算明细",
        url: "/settlement-detail",
        icon: IconFolder,
    },
    {
        section: 'main',
        key: 'accounts',
        title: "商户列表",
        url: "/accounts",
        icon: IconUsers,
    },

    {
        section: 'secondary',
        key: 'setting',
        title: "设置",
        url: "#",
        icon: IconSettings,
    },
    {
        section: 'secondary',
        title: "获取帮助",
        url: "#",
        icon: IconHelp,
    },
    {
        section: 'secondary',
        title: "搜索",
        url: "#",
        icon: IconSearch,
    },

    {
        section: 'documents',
        key: 'database',
        name: "待推出...",
        url: "#",
        icon: IconDatabase,
    },
    {
        section: 'documents',
        key: 'report',
        name: "待推出...",
        url: "#",
        icon: IconReport,
    },
    {
        section: 'documents',
        key: 'word',
        name: "待推出...",
        url: "#",
        icon: IconFileWord,
    },
];