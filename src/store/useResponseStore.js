import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { immer } from 'zustand/middleware/immer'
import apiClient from '../api/client'
import config from '../config/env'

const useResponseStore = create(immer((set) => ({
    responses: [],
    publicityInfos: [],
    statGroupByRundate: [],
    responsesByRundate: [],
    loading: false,
    error: null,
    bears: 0,

    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),

    // 使用配置的 API 地址获取账户列表
    fetchResponses: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/responses', {});
            set(state => {
                state.responses = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取响应评估结果列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    fetchPublicityInfos: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/publicity-infos', {});
            set(state => {
                state.publicityInfos = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取响应评估结果列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    fetchStatGroupByRundate: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/stat-response-group-by-rundate', {});
            set(state => {
                state.statGroupByRundate = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取响应评估结果统计信息失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    getResponsesByRundate: async (run_date) => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/get-responses-by-rundate', { run_date });
            set(state => {
                state.responsesByRundate = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取响应评估结果统计信息失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    // 原有的 fetch 方法保留
    fetch: async (pond) => {
        const response = await fetch(pond);
        set({ accounts: await response.json().data });
    },
})));

export default useResponseStore;

// Object pick, re-renders the component when either state.nuts or state.honey change
// const { accounts } = useAccountStore(
//     useShallow((state) => ({ accounts: state.accounts })),
// )


// Mapped picks, re-renders the component when state.treats changes in order, count or keys
// const accounts = useAccountStore(useShallow((state) => Object.keys(state.accounts)))