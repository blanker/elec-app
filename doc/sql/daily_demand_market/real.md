```sql pg
drop table daily_demand_market;
CREATE TABLE IF NOT EXISTS daily_demand_market (
  id BIGSERIAL PRIMARY KEY,
  account_id varchar(100),
  run_date DATE,
  capAbility varchar(100),
  crtTime BIGINT,
  electricityType varchar(100),
  entityType varchar(100),
  isEa varchar(100),
  loads TEXT,
  loads_gen TEXT,
  loads_use TEXT,
  locateArea varchar(100),
  maxRespLoad varchar(100),
  maxResponceDur varchar(100),
  maxResponcePow varchar(100),
  maxValleyLoad varchar(100),
  minRespLoad varchar(100),
  minResponceDur varchar(100),
  minResponcePow varchar(100),
  minValleyLoad varchar(100),
  resType varchar(100),
  respTime varchar(100),
  score varchar(100),
  userState varchar(100),
  voltLevel varchar(100),
  voltagekV varchar(100),
  "timestamp" BIGINT,
  col01 TEXT,
  col02 TEXT,
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name varchar(100)
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_phone ON daily_demand_market (account_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ddm_run_date ON daily_demand_market (run_date);
CREATE INDEX IF NOT EXISTS idx_daily_tr ON daily_demand_market (tenant_id, run_date);

```

```
# 1 先从d1导出sql
wrangler d1 export data --remote --table daily_demand_market --output ./daily_demand_market.sql

# 2 再把sql转换成sqlite
/usr/local/bin/sqlite3 daily_demand_market.sqlite < daily_demand_market.sql

#
docker run --rm -it --network my-network \
    -v /opt/sqlite:/opt/sqlite \
    crpi-7y9fo7jfr9xmipu3.cn-hangzhou.personal.cr.aliyuncs.com/blankerer/pgloader:latest \
    pgloader /opt/sqlite/pgloader-real.load
```
