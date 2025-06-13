# 数据采集 Chrome 扩展

这是一个用于数据采集的 Chrome 扩展，可以自动处理菜单和表格数据。

## 功能特点

- 自动识别和处理指定菜单
- 采集表格数据
- 拦截和修改 AJAX 请求
- 数据导出功能

## 开发

### 安装依赖

```bash
npm install
```
### d1 sql
settlement
{
    "accountId": "0501001700001962",
    "accountName": "昆明佩升商贸有限公司",
    "feeSum": "-6.81",
    "monthLoad": "30157",
    "resFeeSum": "0",
    "runMonth": 1659283200000,
    "shareFee": "6.81",
    "sharePrice": "0.0002259265"
}

```sql
create index idx_account_tenant ON account (tenant_id);
create index idx_bu_tad ON bu_response_cap(tenant_id, account_id, demand_no);
create index idx_daily_tr ON daily_demand_market(tenant_id, run_date);
create index idx_publicty_tri ON publicity_info(tenant_id,run_date,invited_id);
create index idx_settlement_tr ON settlement(tenant_id, run_month);

> EXPLAIN QUERY PLAN SELECT run_date, count(*) as cnt FROM daily_demand_market WHERE tenant_id = '91440101MA5D693M4Q' GROUP BY run_date ORDER BY run_date ASC

    EXPLAIN QUERY PLAN SELECT * 
      FROM publicity_info
     WHERE tenant_id = '91440101MA5D693M4Q' 
     GROUP BY run_date, invited_id

    EXPLAIN QUERY PLAN SELECT account_id, demand_no, count(*) as cnt 
      FROM bu_response_cap
     WHERE tenant_id ='91440101MA5D693M4Q'
    GROUP BY account_id, demand_no
    ORDER BY demand_no DESC, account_id ASC ;

    EXPLAIN QUERY PLAN SELECT pi.run_date
      ,count(*) as total
      ,count(distinct brc.account_id) as account_cnt
 FROM bu_response_cap brc
    , publicity_info pi 
WHERE brc.demand_no = pi.invited_id 
  AND brc.tenant_id = pi.tenant_id
  AND brc.tenant_id = '91440101MA5D693M4Q'
GROUP BY run_date 
ORDER BY run_date ASC;    

EXPLAIN QUERY PLAN SELECT brc.*
  FROM bu_response_cap brc, publicity_info pi
WHERE brc.demand_no = pi.invited_id
  AND brc.tenant_id = pi.tenant_id
  AND brc.tenant_id = '91440101MA5D693M4Q'
  AND pi.run_date = '2025-04-20'
ORDER BY brc.account_id ASC;

    EXPLAIN QUERY PLAN SELECT *
      FROM settlement 
     WHERE tenant_id = '91440101MA5D693M4Q'
       AND run_month = '2025-02'
     ORDER BY account_id
;

EXPLAIN QUERY PLAN 
SELECT brc.*
  FROM bu_response_cap brc, info_publicity  pi
WHERE brc.demand_no = pi.invited_id
  AND brc.tenant_id = pi.tenant_id
  AND brc.tenant_id = '91440101MA5D693M4Q'
  AND pi.run_date = '2025-06-17'
ORDER BY brc.account_id ASC;

SELECT name, type, sql FROM sqlite_schema WHERE type IN ('index');

CREATE INDEX idx_bu_tda ON bu_response_cap(tenant_id, demand_no, account_id)


alter table account add column tenant_name text;
alter table bu_response_cap add column tenant_name text;
alter table daily_demand_market add column tenant_name text;
alter table publicity_info add column tenant_name text;
alter table settlement add column tenant_name text;



alter table account add column update_time text NOT NULL default '2025-04-26 08:01:49';
alter table bu_response_cap add column update_time text NOT NULL default '2025-04-26 08:01:49';
alter table daily_demand_market add column update_time text NOT NULL default '2025-04-26 08:01:49';
alter table publicity_info add column update_time text NOT NULL default '2025-04-26 08:01:49';
alter table settlement add column update_time text NOT NULL default '2025-04-26 08:01:49';

CREATE TABLE IF NOT EXISTS customer (
    "credit_code" text NOT NULL PRIMARY KEY,
    "name" text,
    "id" text,
    "tenant_id" text,
    "tenant_name" text,
    "update_time" text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant (
    "id" text NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "phone" text,
    "comment" text,
    "create_time" text NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validate_date" text NOT NULL DEFAULT '2050-12-31'
);

insert into tenant
(id, name) VALUES (    '000',    '默认公司');

alter table user add column tenant_id text not null default '000';
alter table settlement add column tenant_id text not null default '000';
alter table daily_demand_market add column tenant_id text not null default '000';
alter table publicity_info add column tenant_id text not null default '000';
alter table bu_response_cap add column tenant_id text not null default '000';
alter table account add column tenant_id text not null default '000';

CREATE TABLE IF NOT EXISTS user (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL,
    phone text NOT NULL,
    password text NOT NULL,
    salt text NOT NULL
);
CREATE UNIQUE INDEX uk_user_phone ON user (phone);


CREATE TABLE IF NOT EXISTS settlement (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
     account_id TEXT NOT NULL, 
     run_month TEXT NOT NULL,  
     account_name TEXT, 
     fee_sum TEXT, 
     month_load TEXT, 
     res_fee_sum TEXT, 
     share_fee TEXT, 
     share_price TEXT,
     ass_fee_sum TEXT,
     bu_sharing TEXT,
     la_sharing TEXT,
     gain_sharing TEXT,
    );
CREATE UNIQUE INDEX uk_se_a_m ON settlement (account_id, run_month);
CREATE  INDEX idx_se_a ON settlement (account_id);
CREATE  INDEX idx_se_m ON settlement ( run_month);

SELECT pi.run_date,count(*) as total, count(distinct brc.account_id)  
  FROM bu_response_cap brc, publicity_info pi
WHERE brc.demand_no = pi.invited_id
GROUP BY run_date
ORDER BY run_date ASC;

SELECT brc.*  
  FROM bu_response_cap brc, publicity_info pi
WHERE brc.demand_no = pi.invited_id
  AND pi.run_date = '2025-04-09'
ORDER BY run_date ASC;

SELECT run_date,count(*) as total, count(distinct account_id)
  FROM bu_response_cap brc, publicity_info pi
GROUP BY run_date

SELECT name, sql FROM sqlite_master where name = 'daily_demand_market'

SELECT name, type, sql FROM sqlite_schema WHERE type IN ('index');

CREATE UNIQUE INDEX unique_email_phone ON daily_demand_market (account_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ddm_run_date ON daily_demand_market(run_date);

CREATE UNIQUE INDEX unique_a_d_l ON bu_response_cap (account_id, demand_no, list_id);
```

### 表结构
```sql
CREATE TABLE publicity_info (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    run_date text,
    invited_id text,
    start_date text,
    end_date text
);

CREATE UNIQUE INDEX unique_r_i ON publicity_info (run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_pi_run_date ON publicity_info(run_date);
CREATE INDEX IF NOT EXISTS idx_pi_invited_id ON publicity_info(invited_id);

PRAGMA optimize;
SELECT name, type, sql FROM sqlite_schema WHERE type IN ('index');

CREATE INDEX idx_brc_account_id ON bu_response_cap (account_id);

CREATE TABLE [bu_response_cap]
(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id text, 
    account_name text, 
    agree_status text, 
    appeal_record text, 
    demand_no text, 
    good_res text, 
    list_id text, 
    punish_res text, 
    real_res text
);

CREATE TABLE [daily_demand_market] 
(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
"account_id" text,
"run_date" text,
"capAbility" text,
"crtTime" integer,
"electricityType" text,
"entityType" text,
"isEa" text,"loads"
 text,"loads_gen" text,
 "loads_use" text,
 "locateArea" text,
 "maxRespLoad" integer,
 "maxResponceDur" text,
 "maxResponcePow" text,
 "maxValleyLoad" integer,
 "minRespLoad" integer,
 "minResponceDur" text,
 "minResponcePow" text,
 "minValleyLoad" integer,
 "resType" text,
 "respTime" text,
 "score" text,
 "userState" text,
 "voltLevel" text,
 "voltagekV" integer,
 "timestamp" integer,
 "col01" text,
 "col02" text
 )
 ```

### 监听url

https://www.kmpex.com/sys/dr/resmktapply-service/beforeTrade/getDeclareReferenceInfo/access?3pcvPmcx=025CP1qlqWWvUmTdFmSo0bmnPGlq5zLTQ5MM85ssTHs0lskbwa0xPetQzaMdNj3803mk.xw5a9UkM10QCvbG3u8IcFbT3oOsxYjNlQvPbe.Bb5PrjS_wNSFpolnrwKxxPYRMKyDxiXLqy8M0G6JgohouDG5wwaicDwZNT7px0_dCK4E26jxURY8En3QTAbNSNepgi09Jt8RkNQVOJ6Tx6bN.VFxuzkDar
https://www.kmpex.com/sys/dr/resmktapply-service/beforeTrade/getDeclareReferenceInfo/access?3pcvPmcx=0pYH7jqlqWWvUmTdFmSo0bmnPGlq5zLTQ5MM85ssTHs0lskbwa0xPetQzaMdNj3803mk.xw5a9UcLyYqzCSkB9DwNI_hMiZQ8qWuAzSYmZ0g6YnhBA7RLulFA8HYaaSkZXW_AFxjcw5QYcio3xfTiD8njAx0qt2r5h3ALSW1hPna9A9xoL0ItZDdvBqM6_wGrbp_VhF586_Xf.8EGCdXP_7hzGgo6wdPn

{
    "code": "200",
    "data": {
        "capAbility": "400",
        "crtTime": 1744981547000,
        "electricityType": "大工业用电",
        "entityType": "需求侧响应用户",
        "id": "0501001700001962",
        "isEa": "N",
        "loads": {
            "H03D45": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H13D15": 122.4,
            "H12D45": 96,
            "H15D30": 124.8,
            "H16D00": 0,
            "H01D30": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H23D45": 0,
            "H09D30": 0,
            "H06D45": 0,
            "H18D15": 0,
            "H21D15": 0,
            "H13D00": 103.2,
            "H17D45": 0,
            "H12D30": 64.8,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H20D00": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H13D30": 110.4,
            "H14D00": 115.2,
            "H19D15": 0,
            "H22D15": 0,
            "H10D45": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H07D30": 0,
            "H21D45": 0,
            "H08D00": 0,
            "H15D45": 151.2,
            "H16D15": 0,
            "H11D00": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H19D00": 0,
            "H03D00": 0,
            "H08D15": 0,
            "H22D45": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H19D30": 0,
            "H12D00": 96,
            "H11D30": 0,
            "H02D45": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H06D00": 0,
            "H22D30": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H14D15": 146.4,
            "H00D15": 0,
            "H13D45": 129.6,
            "H16D30": 0,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "IS24POINT": "N",
            "H05D45": 0,
            "H01D00": 0,
            "H08D30": 0,
            "H20D45": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H14D45": 141.6,
            "H15D15": 139.2,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H04D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H21D00": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H20D30": 0,
            "H15D00": 134.4,
            "H12D15": 91.2,
            "H11D45": 0,
            "H14D30": 117.6,
            "H19D45": 0
        },
        "loads_gen": {
            "H03D00": 0,
            "H03D45": 0,
            "H08D15": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H22D45": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H13D15": 0,
            "H12D45": 0,
            "H19D30": 0,
            "H12D00": 0,
            "H15D30": 0,
            "H11D30": 0,
            "H16D00": 0,
            "H01D30": 0,
            "H02D45": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H23D45": 0,
            "H06D00": 0,
            "H09D30": 0,
            "H22D30": 0,
            "H06D45": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H18D15": 0,
            "H14D15": 0,
            "H21D15": 0,
            "H00D15": 0,
            "H13D45": 0,
            "H16D30": 0,
            "H13D00": 0,
            "H17D45": 0,
            "H12D30": 0,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "H05D45": 0,
            "H01D00": 0,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H08D30": 0,
            "H20D00": 0,
            "H20D45": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H13D30": 0,
            "H14D00": 0,
            "H14D45": 0,
            "H19D15": 0,
            "H15D15": 0,
            "H22D15": 0,
            "H10D45": 0,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H04D00": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H07D30": 0,
            "H21D00": 0,
            "H21D45": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H08D00": 0,
            "H20D30": 0,
            "H15D00": 0,
            "H15D45": 0,
            "H16D15": 0,
            "H12D15": 0,
            "H11D00": 0,
            "H11D45": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H14D30": 0,
            "H19D00": 0,
            "H19D45": 0
        },
        "loads_use": {
            "H03D00": 0,
            "H03D45": 0,
            "H08D15": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H22D45": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H13D15": 122.4,
            "H12D45": 96,
            "H19D30": 0,
            "H12D00": 96,
            "H15D30": 124.8,
            "H11D30": 0,
            "H16D00": 0,
            "H01D30": 0,
            "H02D45": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H23D45": 0,
            "H06D00": 0,
            "H09D30": 0,
            "H22D30": 0,
            "H06D45": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H18D15": 0,
            "H14D15": 146.4,
            "H21D15": 0,
            "H00D15": 0,
            "H13D45": 129.6,
            "H16D30": 0,
            "H13D00": 103.2,
            "H17D45": 0,
            "H12D30": 64.8,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "H05D45": 0,
            "H01D00": 0,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H08D30": 0,
            "H20D00": 0,
            "H20D45": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H13D30": 110.4,
            "H14D00": 115.2,
            "H14D45": 141.6,
            "H19D15": 0,
            "H15D15": 139.2,
            "H22D15": 0,
            "H10D45": 0,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H04D00": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H07D30": 0,
            "H21D00": 0,
            "H21D45": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H08D00": 0,
            "H20D30": 0,
            "H15D00": 134.4,
            "H15D45": 151.2,
            "H16D15": 0,
            "H12D15": 91.2,
            "H11D00": 0,
            "H11D45": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H14D30": 117.6,
            "H19D00": 0,
            "H19D45": 0
        },
        "locateArea": "050100",
        "maxRespLoad": 400,
        "maxResponceDur": "12",
        "maxResponcePow": "400",
        "maxValleyLoad": 400,
        "minRespLoad": 0,
        "minResponceDur": "0",
        "minResponcePow": "0",
        "minValleyLoad": 0,
        "resType": "工业负荷",
        "respTime": "00:00:00~23:59:59",
        "score": "0",
        "userState": "RUN",
        "voltLevel": "交流10kV",
        "voltagekV": 0
    },
    "msg": "查询需求响应申报-申报参考信息",
    "succ": true,
    "timestamp": 1744984941717
}

{
    "code": "200",
    "data": {
        "capAbility": "315",
        "crtTime": 1744985337000,
        "electricityType": "大工业用电",
        "entityType": "需求侧响应用户",
        "id": "0502001400687144",
        "isEa": "N",
        "loads": {
            "H03D45": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H13D15": 80,
            "H12D45": 40,
            "H15D30": 100,
            "H16D00": 0,
            "H01D30": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H23D45": 0,
            "H09D30": 0,
            "H06D45": 0,
            "H18D15": 0,
            "H21D15": 0,
            "H13D00": 60,
            "H17D45": 0,
            "H12D30": 60,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H20D00": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H13D30": 100,
            "H14D00": 120,
            "H19D15": 0,
            "H22D15": 0,
            "H10D45": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H07D30": 0,
            "H21D45": 0,
            "H08D00": 0,
            "H15D45": 120,
            "H16D15": 0,
            "H11D00": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H19D00": 0,
            "H03D00": 0,
            "H08D15": 0,
            "H22D45": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H19D30": 0,
            "H12D00": 40,
            "H11D30": 0,
            "H02D45": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H06D00": 0,
            "H22D30": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H14D15": 120,
            "H00D15": 0,
            "H13D45": 100,
            "H16D30": 0,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "IS24POINT": "N",
            "H05D45": 0,
            "H01D00": 0,
            "H08D30": 0,
            "H20D45": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H14D45": 120,
            "H15D15": 120,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H04D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H21D00": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H20D30": 0,
            "H15D00": 120,
            "H12D15": 80,
            "H11D45": 0,
            "H14D30": 140,
            "H19D45": 0
        },
        "loads_gen": {
            "H03D00": 0,
            "H03D45": 0,
            "H08D15": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H22D45": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H13D15": 0,
            "H12D45": 0,
            "H19D30": 0,
            "H12D00": 0,
            "H15D30": 0,
            "H11D30": 0,
            "H16D00": 0,
            "H01D30": 0,
            "H02D45": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H23D45": 0,
            "H06D00": 0,
            "H09D30": 0,
            "H22D30": 0,
            "H06D45": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H18D15": 0,
            "H14D15": 0,
            "H21D15": 0,
            "H00D15": 0,
            "H13D45": 0,
            "H16D30": 0,
            "H13D00": 0,
            "H17D45": 0,
            "H12D30": 0,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "H05D45": 0,
            "H01D00": 0,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H08D30": 0,
            "H20D00": 0,
            "H20D45": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H13D30": 0,
            "H14D00": 0,
            "H14D45": 0,
            "H19D15": 0,
            "H15D15": 0,
            "H22D15": 0,
            "H10D45": 0,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H04D00": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H07D30": 0,
            "H21D00": 0,
            "H21D45": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H08D00": 0,
            "H20D30": 0,
            "H15D00": 0,
            "H15D45": 0,
            "H16D15": 0,
            "H12D15": 0,
            "H11D00": 0,
            "H11D45": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H14D30": 0,
            "H19D00": 0,
            "H19D45": 0
        },
        "loads_use": {
            "H03D00": 0,
            "H03D45": 0,
            "H08D15": 0,
            "H04D15": 0,
            "H10D15": 0,
            "H22D45": 0,
            "H06D30": 0,
            "H22D00": 0,
            "H23D15": 0,
            "H07D45": 0,
            "H02D30": 0,
            "H07D00": 0,
            "H21D30": 0,
            "H16D45": 0,
            "H17D15": 0,
            "H20D15": 0,
            "H13D15": 80,
            "H12D45": 40,
            "H19D30": 0,
            "H12D00": 40,
            "H15D30": 100,
            "H11D30": 0,
            "H16D00": 0,
            "H01D30": 0,
            "H02D45": 0,
            "H07D15": 0,
            "H02D00": 0,
            "H03D15": 0,
            "H11D15": 0,
            "H23D45": 0,
            "H06D00": 0,
            "H09D30": 0,
            "H22D30": 0,
            "H06D45": 0,
            "H05D30": 0,
            "H23D00": 0,
            "H18D15": 0,
            "H14D15": 120,
            "H21D15": 0,
            "H00D15": 0,
            "H13D45": 100,
            "H16D30": 0,
            "H13D00": 60,
            "H17D45": 0,
            "H12D30": 60,
            "H17D00": 0,
            "H06D15": 0,
            "H00D30": 0,
            "H05D45": 0,
            "H01D00": 0,
            "H01D45": 0,
            "H02D15": 0,
            "H09D45": 0,
            "H08D30": 0,
            "H20D00": 0,
            "H20D45": 0,
            "H04D30": 0,
            "H05D00": 0,
            "H23D30": 0,
            "H09D00": 0,
            "H13D30": 100,
            "H14D00": 120,
            "H14D45": 120,
            "H19D15": 0,
            "H15D15": 120,
            "H22D15": 0,
            "H10D45": 0,
            "H17D30": 0,
            "H10D00": 0,
            "H18D00": 0,
            "H18D45": 0,
            "H04D45": 0,
            "H04D00": 0,
            "H05D15": 0,
            "H00D00": 0,
            "H00D45": 0,
            "H01D15": 0,
            "H07D30": 0,
            "H21D00": 0,
            "H21D45": 0,
            "H09D15": 0,
            "H08D45": 0,
            "H03D30": 0,
            "H08D00": 0,
            "H20D30": 0,
            "H15D00": 120,
            "H15D45": 120,
            "H16D15": 0,
            "H12D15": 80,
            "H11D00": 0,
            "H11D45": 0,
            "H18D30": 0,
            "H10D30": 0,
            "H14D30": 140,
            "H19D00": 0,
            "H19D45": 0
        },
        "locateArea": "050200",
        "maxRespLoad": 815,
        "maxResponceDur": "6",
        "maxResponcePow": "815",
        "maxValleyLoad": 815,
        "minRespLoad": 0,
        "minResponceDur": "0",
        "minResponcePow": "0",
        "minValleyLoad": 0,
        "resType": "工业负荷",
        "respTime": "00:00:00~23:59:59",
        "score": "0",
        "userState": "RUN",
        "voltLevel": "交流10kV",
        "voltagekV": 0
    },
    "msg": "查询需求响应申报-申报参考信息",
    "succ": true,
    "timestamp": 1744985721664
}


https://www.kmpex.com/sys/dr/resmktapplymanage-service/resCapPublic/getBuResponseCapByAccountIdAndListId/page/access?3pcvPmcx=09C1VcqlqWWvUmTdFmSo0bmnPGlq5zLTQ5MM85ssTHs0lskbwa0xPetQzaMdNj3803mk.xw5a91cT7Rbd58wsjKez5spW6nGJNoQ5QWnZH1DBdh51T1o2Ca
https://www.kmpex.com/sys/dr/resmktapplymanage-service/resCapPublic/getBuResponseCapByAccountIdAndListId/page/access?3pcvPmcx=0fjTckGlqWWvUmTdFmSo0bmnPGlq5zLTQ5MM85ssTHs0lskbwa0xPetQzaMdNj3803mk.xw5a91c7xF66GSbTKD42Pg8aycJdUUTLzGihBfQ0vDWc.eyBDa
{
    "code": "200",
    "data": {
        "rows": [
            {
                "accountId": "0501001700001962",
                "accountName": "昆明佩升商贸有限公司",
                "agreeStatus": "未确认",
                "appealRecord": "0",
                "demandNo": "20250414-05-002-03",
                "goodRes": "0",
                "listId": "LISTe3a828a417c8475d8c38be869664cd5a",
                "punishRes": "0",
                "realRes": "-30"
            }
        ],
        "total": 1
    },
    "msg": "响应评估结果公示-响应评估结果分页查询",
    "succ": true,
    "timestamp": 1744985354771
}

{
  "code": "200",
  "data": {
    "rows": [
      {
        "accountId": "0501001700009521",
        "accountName": "昆明佩升商贸有限公司",
        "agreeStatus": "未确认",
        "appealRecord": "0",
        "demandNo": "20250414-05-002-03",
        "goodRes": "19.5",
        "listId": "LISTe3a828a417c8475d8c38be869664cd5a",
        "punishRes": "0",
        "realRes": "36.83"
      }
    ],
    "total": 1
  },
  "msg": "响应评估结果公示-响应评估结果分页查询",
  "succ": true,
  "timestamp": 1744985529300
}