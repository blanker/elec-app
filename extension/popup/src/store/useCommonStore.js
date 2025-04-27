import { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import apiClient from '@/api/client'
import config from '@/config/env'

// 判断是否在扩展环境
const isExtension = typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined';

// 定义 Chrome Storage (如果可用)
const chromeStorage = isExtension ? {
    getItem: (name) => {
        return new Promise((resolve) => {
            chrome.storage.local.get([name], (result) => {
                resolve(result[name] ? result[name] : null);
            });
        });
    },
    setItem: (name, value) => {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [name]: value }, () => {
                resolve();
            });
        });
    },
    removeItem: (name) => {
        return new Promise((resolve) => {
            chrome.storage.local.remove(name, () => {
                resolve();
            });
        });
    },
} : null; // 如果不在扩展环境，则为 null

// 选择存储方式：优先使用 chromeStorage，否则回退到 localStorage
const storageAdapter = chromeStorage ? chromeStorage : localStorage;
// 或者回退到 sessionStorage: const storageAdapter = chromeStorage ? chromeStorage : sessionStorage;
// 注意：localStorage/sessionStorage 需要同步接口，而 chromeStorage 是异步的。
// Zustand 的 createJSONStorage 会处理同步/异步存储对象的差异。

const baseCommonStore = create()(
    persist(
        immer((set) => ({
            count: 0,
            user: null,
            token: null,
            loading: false,
            error: false,
            login: async (data) => {
                try {
                    set(state => { state.loading = true; state.error = null; });
                    const response = await apiClient.post('/login', { data });
                    if (response.data.success) {
                        const { token, ...user } = response.data.data;
                        set(state => {
                            state.user = user;
                            state.token = token;
                            state.loading = false;
                        });
                        console.log('登录成功:', response.data);
                        return true;
                    } else {
                        set(state => {
                            state.error = response.data.error;
                            state.loading = false;
                        });
                        console.log('登录失败:', response.data);
                        return false;
                    }
                } catch (error) {
                    console.error('登录失败:', error);
                    set(state => {
                        state.error = error.message;
                        state.loading = false;
                    });
                    return false;
                }
            }, // login
            increment: (qty) =>
                set((state) => {
                    state.count += qty
                }),
            decrement: (qty) =>
                set((state) => {
                    state.count -= qty
                }),
            logout: () => {
                set(state => {
                    state.user = null;
                    state.token = null;
                    state.loading = false;
                    state.error = null;
                });
            },
        })),
        {
            name: 'common-storage',
            // 使用选择的存储适配器
            storage: createJSONStorage(() => storageAdapter),
            // ... 其他 persist 配置 ...
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => !['foo'].includes(key)),
                ),
        },
    )
)

const useCommonStore = createSelectors(baseCommonStore);
export default useCommonStore;

function createSelectors(store) {
    store.use = {}
    for (const k of Object.keys(store.getState())) {
        ; (store.use)[k] = () => store((s) => s[k])
    }

    return store
}