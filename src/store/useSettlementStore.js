import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { immer } from 'zustand/middleware/immer'
import apiClient from '../api/client'
import config from '../config/env'

const useSettlementStore = create(immer((set) => ({
    settlements: [],
    countByMonth: [],
    loading: false,
    error: null,
    bears: 0,

    settlementDetail: [],

    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),

    // 使用配置的 API 地址获取账户列表
    fetchSettlements: async (date) => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/settlements-by-month', { data: { date } });
            set(state => {
                state.settlements = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取结算数据列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    fetchSettlementDetail: async (date) => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/settlement-detail-by-month', { data: { date } });
            set(state => {
                state.settlementDetail = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取结算数据列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },
    fetchCountByMonth: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/settlement-count-by-month', {});
            set(state => {
                state.countByMonth = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取按月份统计结算数据失败:', error);
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

export default useSettlementStore;

// Object pick, re-renders the component when either state.nuts or state.honey change
// const { accounts } = useAccountStore(
//     useShallow((state) => ({ accounts: state.accounts })),
// )


// Mapped picks, re-renders the component when state.treats changes in order, count or keys
// const accounts = useAccountStore(useShallow((state) => Object.keys(state.accounts)))