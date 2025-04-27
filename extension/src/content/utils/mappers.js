import { menus } from '../../config/menus';

// 创建标题到字段名的映射
export const titleToNameMap = {};

// 根据菜单名称更新标题映射
export function updateTitleMapByMenuName(menuName) {
  // 清空当前映射
  Object.keys(titleToNameMap).forEach(key => delete titleToNameMap[key]);
  
  // 查找对应菜单的列配置
  const menu = menus.find(item => item.name === menuName);
  
  // 如果找到菜单配置，更新映射
  if (menu && Array.isArray(menu.columns)) {
    menu.columns.forEach(col => {
      titleToNameMap[col.title] = col.name;
    });
  }
  
  return titleToNameMap;
}

// 获取当前菜单的表名
export function getTableName(menuName) {
  return menus.find(m => m.name === menuName)?.table || null;
}