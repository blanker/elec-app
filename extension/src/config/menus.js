// 菜单配置
export const menus = [
  {
    name: '需求响应申报',
    table: 'account',
    in_ant_table_body: false,
    urlPattern: 'ResponseApply-noca',
    columns: [
      { name: 'account', title: '户号' },
      { name: 'name', title: '用户名' },
    ],
    extra: {
      run_date: {
        element: 'div',
        pattern: /^\s*运行日[：:]\s*(\d{4}-\d{2}-\d{2})\s*$/,
      }
    }
  },
  {
    name: '响应评估结果公示',
    table: 'account',
    in_ant_table_body: true,
    urlPattern: 'ResultsPublicity',
    columns: [
      { name: 'account', title: '户号' },
      { name: 'name', title: '用户名' },
    ]
  },
  {
    name: '月结算详情',
    table: 'account',
    urlPattern: 'SettlementSum',
    in_ant_table_body: false,
    columns: [
      { name: 'account', title: '户号' },
      { name: 'name', title: '用户名' },
    ],
  }
];

export const links = [
  // 需求响应申报-申报参考信息
  '/resmktapply-service/beforeTrade/getDeclareReferenceInfo/access',
  // 响应评估结果公示
  '/resmktapplymanage-service/resCapPublic/getBuResponseCapByAccountIdAndListId/page/access',
  '/resmktapplysettle-service/monthSettle/getSettleMonthTotal/page/access',
  //查询交易主体信息
  '/resmktapply-service/index/getLaInfo/access',
];

export const quick = false;
export const test = false;
export const constants = {
  nextPageInterval: quick ? 1000 : 5000,
  nextRowInterval: quick ? 1000 : 5000,
  readyIdle: quick ? 2000 : 5000,
  tbodyClass: '.ant-table-tbody',
  btnId: 'elec-extension-floating-btn',
  menuBtnId: 'elec-extension-floating-btn-menu',
};