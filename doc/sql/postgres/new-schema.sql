drop table elec_app.account ;
CREATE TABLE IF NOT EXISTS elec_app.account (
  id varchar(100) PRIMARY KEY,
  name varchar(255),
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name varchar(255),
  credit_code varchar(100)
);
CREATE INDEX IF NOT EXISTS idx_account_tenant ON elec_app.account (tenant_id);

-- bu_response_cap
drop table elec_app.bu_response_cap ;
CREATE TABLE IF NOT EXISTS elec_app.bu_response_cap (
  id BIGSERIAL PRIMARY KEY,
  account_id varchar(100),
  account_name varchar(255),
  agree_status varchar(100),
  appeal_record varchar(100),
  demand_no varchar(100),
  good_res varchar(100),
  list_id varchar(100),
  punish_res varchar(100),
  real_res varchar(100),
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_a_d_l ON bu_response_cap (account_id, demand_no, list_id);
CREATE INDEX IF NOT EXISTS idx_brc_account_id ON bu_response_cap (account_id);
CREATE INDEX IF NOT EXISTS idx_bu_tda ON bu_response_cap (tenant_id, demand_no, account_id);

-- customer
CREATE TABLE IF NOT EXISTS customer (
  credit_code varchar(100) PRIMARY KEY,
  name varchar(255),
  id varchar(100),
  tenant_id varchar(100),
  tenant_name varchar(255),
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- daily_demand_market
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
  maxRespLoad INTEGER,
  maxResponceDur varchar(100),
  maxResponcePow varchar(100),
  maxValleyLoad INTEGER,
  minRespLoad INTEGER,
  minResponceDur varchar(100),
  minResponcePow varchar(100),
  minValleyLoad INTEGER,
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

-- daily_demand_market_new（如为临时表，可按需保留）
CREATE TABLE IF NOT EXISTS daily_demand_market_new (
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
  maxRespLoad INTEGER,
  maxResponceDur varchar(100),
  maxResponcePow varchar(100),
  maxValleyLoad INTEGER,
  minRespLoad INTEGER,
  minResponceDur varchar(100),
  minResponcePow varchar(100),
  minValleyLoad INTEGER,
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
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_phone_1 ON daily_demand_market_new (account_id, run_date);


-- info_publicity（SQLite 原始表）
CREATE TABLE IF NOT EXISTS info_publicity (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id varchar(100),
  start_date DATE,
  end_date DATE,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  tenant_name varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ip_r_i ON info_publicity (tenant_id, run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_ip_run_date ON info_publicity (tenant_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ip_invited_id ON info_publicity (tenant_id, invited_id);

-- info_publicity_list
CREATE TABLE IF NOT EXISTS info_publicity_list (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id varchar(100),
  start_date DATE,
  end_date DATE,
  data_type  varchar(100),
  handle_note  varchar(100),
  invite_name  varchar(100),
  list_id  varchar(100),
  rec_time TIMESTAMPTZ,
  rsp_type  varchar(100),
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id  varchar(100) NOT NULL DEFAULT '000',
  tenant_name  varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ipl_r_i ON info_publicity_list (tenant_id, run_date, invited_id, list_id);

-- publicity_info（代码中也使用此表，保留）
CREATE TABLE IF NOT EXISTS publicity_info (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id varchar(100),
  start_date DATE,
  end_date DATE,
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_r_i ON publicity_info (run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_pi_run_date ON publicity_info (run_date);
CREATE INDEX IF NOT EXISTS idx_pi_invited_id ON publicity_info (invited_id);
CREATE INDEX IF NOT EXISTS idx_publicty_tri ON publicity_info (tenant_id, run_date, invited_id);

-- settlement
CREATE TABLE IF NOT EXISTS settlement (
  id BIGSERIAL PRIMARY KEY,
  account_id varchar(100) NOT NULL,
  run_month varchar(100) NOT NULL,
  account_name varchar(255),
  fee_sum varchar(100),
  month_load varchar(100),
  res_fee_sum varchar(100),
  share_fee varchar(100),
  share_price varchar(100),
  ass_fee_sum varchar(100),
  bu_sharing varchar(100),
  la_sharing varchar(100),
  gain_sharing varchar(100),
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_se_a_m ON settlement (account_id, run_month);
CREATE INDEX IF NOT EXISTS idx_se_a ON settlement (account_id);
CREATE INDEX IF NOT EXISTS idx_se_m ON settlement (run_month);
CREATE INDEX IF NOT EXISTS idx_settlement_tr ON settlement (tenant_id, run_month);

-- settlement_detail
CREATE TABLE IF NOT EXISTS settlement_detail (
  id BIGSERIAL PRIMARY KEY,
  run_month varchar(100),
  run_date DATE,
  account_id varchar(100),
  account_name varchar(255),
  ass_fee_sum varchar(100),
  bu_sharing varchar(100),
  la_sharing varchar(100),
  res_fee_sum varchar(100),
  total_revenue varchar(100),
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id varchar(100) NOT NULL DEFAULT '000',
  tenant_name varchar(255)
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sd_tmda ON settlement_detail (tenant_id, run_month, run_date, account_id);


-- tenant
CREATE TABLE IF NOT EXISTS tenant (
  id TEXT PRIMARY KEY,
  name varchar(255) NOT NULL,
  phone varchar(100),
  comment varchar(255),
  create_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validate_date DATE NOT NULL DEFAULT '2050-12-31'
);

-- user
CREATE TABLE IF NOT EXISTS "user" (
  id BIGSERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  phone varchar(100) NOT NULL,
  password varchar(100) NOT NULL,
  salt varchar(100) NOT NULL,
  tenant_id varchar(100) NOT NULL DEFAULT '000'
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_user_phone ON "user" (phone);

-- user_tenant
CREATE TABLE IF NOT EXISTS user_tenant (
  id BIGSERIAL PRIMARY KEY,
  phone varchar(100) NOT NULL,
  tenant_id varchar(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ut_pt ON user_tenant (phone, tenant_id);
