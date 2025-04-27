document.addEventListener('DOMContentLoaded', function() {
  // 获取元素
  const clickCountElement = document.getElementById('clickCount');
  const dataCountElement = document.getElementById('dataCount');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  // 加载数据
  loadData();
  
  // 添加事件监听器
  exportBtn.addEventListener('click', exportData);
  clearBtn.addEventListener('click', clearData);
  
  // 加载数据
  function loadData() {
    chrome.storage.local.get(['clickCount', 'tableData'], function(result) {
      // 更新点击次数
      clickCountElement.textContent = result.clickCount || 0;
      
      // 计算数据总数
      const tableData = result.tableData || {};
      let totalCount = 0;
      
      for (const table in tableData) {
        if (Array.isArray(tableData[table])) {
          totalCount += tableData[table].length;
        }
      }
      
      dataCountElement.textContent = totalCount;
    });
  }
  
  // 导出数据
  function exportData() {
    chrome.storage.local.get(['tableData'], function(result) {
      const tableData = result.tableData || {};
      
      // 检查是否有数据
      if (Object.keys(tableData).length === 0) {
        alert('没有可导出的数据');
        return;
      }
      
      // 将数据转换为 JSON
      const jsonData = JSON.stringify(tableData, null, 2);
      
      // 创建下载链接
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 创建下载元素
      const a = document.createElement('a');
      a.href = url;
      a.download = `data_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      
      // 释放 URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    });
  }
  
  // 清除数据
  function clearData() {
    if (confirm('确定要清除所有数据吗？')) {
      chrome.storage.local.set({ tableData: {}, clickCount: 0 }, function() {
        loadData();
        alert('数据已清除');
      });
    }
  }
});