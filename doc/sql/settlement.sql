CREATE TABLE settlement_detail (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    run_month text,
    run_date text,
    account_id text,
    account_name text,
    ass_fee_sum text,
    bu_sharing text,
    la_sharing text,
    res_fee_sum text,
    total_revenue text,
    update_time text NOT NULL default CURRENT_TIMESTAMP,
    tenant_id text not null default '000',
    tenant_name text
);

CREATE UNIQUE INDEX uk_sd_tmda ON settlement_detail (tenant_id, run_month, run_date, account_id);


{
  "code": "200",
  "data": {
    "rows": [
      {
        "accountId": "0501001700001962", // 营销户号
        "accountName": "昆明佩升商贸有限公司", // 用户名
        "assFeeSum": "0", // 总响应考核费用(元)
        "buSharing": "68.68", // 用户分成收益(元)
        "laSharing": "29.44", // 负荷聚合商分成收益(元)
        "resFeeSum": "98.12", // 响应费用(元)
        "runDay": 1743609600000,
        "totalRevenue": "98.12" // 总响应收益(元)
      },
      {
        "accountId": "0501001700001962",
        "accountName": "昆明佩升商贸有限公司",
        "assFeeSum": "0",
        "buSharing": "0",
        "laSharing": "0",
        "resFeeSum": "0",
        "runDay": 1743696000000,
        "totalRevenue": "0"
      },
      {
        "accountId": "0501001700001962",
        "accountName": "昆明佩升商贸有限公司",
        "assFeeSum": "0",
        "buSharing": "23.74",
        "laSharing": "10.18",
        "resFeeSum": "33.92",
        "runDay": 1744128000000,
        "totalRevenue": "33.92"
      },
      {
        "accountId": "0501001700001962",
        "accountName": "昆明佩升商贸有限公司",
        "assFeeSum": "0",
        "buSharing": "9.8",
        "laSharing": "4.2",
        "resFeeSum": "14",
        "runDay": 1744214400000,
        "totalRevenue": "14"
      },
      {
        "accountId": "0501001700001962",
        "accountName": "昆明佩升商贸有限公司",
        "assFeeSum": "0",
        "buSharing": "7.87",
        "laSharing": "3.38",
        "resFeeSum": "11.25",
        "runDay": 1744300800000,
        "totalRevenue": "11.25"
      },
      {
        "accountId": "0501001700001962",
        "accountName": "昆明佩升商贸有限公司",
        "assFeeSum": "0",
        "buSharing": "0",
        "laSharing": "0",
        "resFeeSum": "0",
        "runDay": 1744732800000,
        "totalRevenue": "0"
      }
    ],
    "total": 11
  },
  "msg": "查询月结算详情-日清算详细信息_月度修正",
  "succ": true,
  "timestamp": 1749822989613
}