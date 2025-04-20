import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { immer } from 'zustand/middleware/immer'
import apiClient from '../api/client'
import config from '../config/env'

const useRundateStore = create(immer((set) => ({
    rundates: [],
    rundateData: [],
    loading: false,
    error: null,
    bears: 0,

    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),

    fetchRundates: async () => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/rundates', {});
            set(state => {
                state.rundates = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取运行日列表失败:', error);
            set(state => {
                state.error = error.message;
                state.loading = false;
            });
        }
    },

    fetchRundateData: async (run_date) => {
        try {
            set(state => { state.loading = true; state.error = null; });
            console.log(`从 ${config.apiHost} 获取数据`);

            const response = await apiClient.post('/rundate-data', { run_date });
            set(state => {
                state.rundateData = response.data.data || response.data;
                state.loading = false;
            });
        } catch (error) {
            console.error('获取运行日列表失败:', error);
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

export default useRundateStore;

// Object pick, re-renders the component when either state.nuts or state.honey change
// const { accounts } = useAccountStore(
//     useShallow((state) => ({ accounts: state.accounts })),
// )


// Mapped picks, re-renders the component when state.treats changes in order, count or keys
// const accounts = useAccountStore(useShallow((state) => Object.keys(state.accounts)))