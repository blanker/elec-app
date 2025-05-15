import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

import apiClient from '../api/client'
import config from '../config/env'

const useUserStore = create(immer(persist((set) => ({
    user: undefined,
    token: undefined,
    error: null,
    loading: false,
    logout: () => {
        set(state => {
            state.user = undefined;
            state.token = undefined;
        });
    },
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
                return true;
            } else {
                set(state => {
                    state.error = response.data.error;
                    state.loading = false;
                });
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
    },
    // 使用配置的 API 地址获取账户列表
    fetchAccounts: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/accounts', {});
            set(state => {
                state.accounts = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取账户列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    switchTenant: async (tenant) => {
        try {
            set(state => { state.loading = true; state.error = null; });
            const response = await apiClient.post('/switchTenant', { tenant });
            console.log('switchTenant response: ', response);
            if (response.data.success) {
                set(state => {
                    state.user = response.data.data;
                    state.loading = false;
                })
                return true;
            }
        } catch (error) {
            console.error('切换租户失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    }, // switchTenant
    // 原有的 fetch 方法保留
    fetch: async (pond) => {
        const response = await fetch(pond);
        set({ accounts: await response.json().data });
    },
}),
    {
        name: 'user-storage', // unique name
        getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        partialize: (state) => ({
            user: state.user,
            token: state.token
        }),
    }
)));

export default useUserStore;

// Object pick, re-renders the component when either state.nuts or state.honey change
// const { accounts } = useAccountStore(
//     useShallow((state) => ({ accounts: state.accounts })),
// )


// Mapped picks, re-renders the component when state.treats changes in order, count or keys
// const accounts = useAccountStore(useShallow((state) => Object.keys(state.accounts)))