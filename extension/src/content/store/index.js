import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 创建状态存储
const useStore = create(persist((set, get) => ({
    // 菜单相关状态
    foundMenu: false,
    // li元素
    defaultMenuItem: null,

    currentMenuIndex: 0,
    currentMenu: null,

    table: null,
    processing: false,

    // 设置菜单
    setFoundMenu: (menu) => set({ foundMenu: menu }),
    setDefaultMenu: (item) => set({ defaultMenuItem: item }),
    // 设置当前菜单索引
    setCurrentMenuIndex: (index) => set({ currentMenuIndex: index }),

    // 设置当前菜单
    setCurrentMenu: (menu) => {
        console.log('setCurrentMenu', menu);
        set({ currentMenu: menu })
    },

    // 设置表格
    setTable: (table) => set({ table: table }),

    // 设置处理状态
    setProcessing: (processing) => set({ processing: processing }),

    // 重置状态
    resetState: () => set({
        currentMenuIndex: 0,
        currentMenu: null,
        processing: false
    }),

    // 进入下一个菜单
    nextMenu: () => {
        const { foundMenu, currentMenuIndex } = get();
        if (foundMenu && Array.isArray(foundMenu)) {
            if (currentMenuIndex < foundMenu.length - 1) {
                set({ currentMenuIndex: currentMenuIndex + 1 });
                return true;
            } else {
                // 所有菜单都已处理，重置状态
                set({
                    currentMenuIndex: 0,
                    currentMenu: null,
                    processing: false
                });
                return false;
            }
        }
        return false;
    },
}),
    {
        name: 'menu-storage', // 存储的名称
        storage: createJSONStorage(() => sessionStorage), // 使用 localStorage
        partialize: (state) => ({
            // 只持久化这些字段
            //foundMenu: state.foundMenu,
            currentMenuIndex: state.currentMenuIndex,
            //currentMenu: state.currentMenu,
            //table: state.table,
            processing: state.processing
        }),
    }
)
);
export default useStore;