import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { ConfigProvider, theme as antd_theme } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const initialState = {
    theme: "system",
    setTheme: () => null,
}

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(
        () => (localStorage.getItem(storageKey)) || defaultTheme
    )

    const antdTheme = useMemo(() => {
        let result = antd_theme.darkAlgorithm;
        if (theme === "light") {
            result = antd_theme.defaultAlgorithm;
        }
        if (theme === "system") {
            result = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? antd_theme.darkAlgorithm
                : antd_theme.defaultAlgorithm
        }
        return result;
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            <ConfigProvider
                locale={locale}
                theme={{
                    algorithm: antdTheme,
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}

export const useThemeS2 = () => {
    const { theme } = useTheme();
    const s2Theme = useMemo(() => {
        let result = 'default';
        if (theme === "system") {
            result = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? 'dark'
                : 'default'
        } else if (theme === 'dark') {
            result = 'dark';
        }
        return { name: result };
    }, [theme]);

    return { s2Theme };
}