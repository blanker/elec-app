-- account
CREATE TABLE IF NOT EXISTS account (
  id TEXT PRIMARY KEY,
  name TEXT,
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT,
  credit_code TEXT
);
CREATE INDEX IF NOT EXISTS idx_account_tenant ON account (tenant_id);

-- bu_response_cap
CREATE TABLE IF NOT EXISTS bu_response_cap (
  id BIGSERIAL PRIMARY KEY,
  account_id TEXT,
  account_name TEXT,
  agree_status TEXT,
  appeal_record TEXT,
  demand_no TEXT,
  good_res TEXT,
  list_id TEXT,
  punish_res TEXT,
  real_res TEXT,
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_a_d_l ON bu_response_cap (account_id, demand_no, list_id);
CREATE INDEX IF NOT EXISTS idx_brc_account_id ON bu_response_cap (account_id);
CREATE INDEX IF NOT EXISTS idx_bu_tda ON bu_response_cap (tenant_id, demand_no, account_id);

-- customer
CREATE TABLE IF NOT EXISTS customer (
  credit_code TEXT PRIMARY KEY,
  name TEXT,
  id TEXT,
  tenant_id TEXT,
  tenant_name TEXT,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- daily_demand_market
CREATE TABLE IF NOT EXISTS daily_demand_market (
  id BIGSERIAL PRIMARY KEY,
  account_id TEXT,
  run_date DATE,
  capAbility TEXT,
  crtTime BIGINT,
  electricityType TEXT,
  entityType TEXT,
  isEa TEXT,
  loads TEXT,
  loads_gen TEXT,
  loads_use TEXT,
  locateArea TEXT,
  maxRespLoad INTEGER,
  maxResponceDur TEXT,
  maxResponcePow TEXT,
  maxValleyLoad INTEGER,
  minRespLoad INTEGER,
  minResponceDur TEXT,
  minResponcePow TEXT,
  minValleyLoad INTEGER,
  resType TEXT,
  respTime TEXT,
  score TEXT,
  userState TEXT,
  voltLevel TEXT,
  voltagekV INTEGER,
  "timestamp" BIGINT,
  col01 TEXT,
  col02 TEXT,
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_phone ON daily_demand_market (account_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ddm_run_date ON daily_demand_market (run_date);
CREATE INDEX IF NOT EXISTS idx_daily_tr ON daily_demand_market (tenant_id, run_date);

-- daily_demand_market_new（如为临时表，可按需保留）
CREATE TABLE IF NOT EXISTS daily_demand_market_new (
  id BIGSERIAL PRIMARY KEY,
  account_id TEXT,
  run_date DATE,
  capAbility TEXT,
  crtTime BIGINT,
  electricityType TEXT,
  entityType TEXT,
  isEa TEXT,
  loads TEXT,
  loads_gen TEXT,
  loads_use TEXT,
  locateArea TEXT,
  maxRespLoad INTEGER,
  maxResponceDur TEXT,
  maxResponcePow TEXT,
  maxValleyLoad INTEGER,
  minRespLoad INTEGER,
  minResponceDur TEXT,
  minResponcePow TEXT,
  minValleyLoad INTEGER,
  resType TEXT,
  respTime TEXT,
  score TEXT,
  userState TEXT,
  voltLevel TEXT,
  voltagekV INTEGER,
  "timestamp" BIGINT,
  col01 TEXT,
  col02 TEXT,
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_phone_1 ON daily_demand_market_new (account_id, run_date);

-- info_publicity（SQLite 原始表）
CREATE TABLE IF NOT EXISTS info_publicity (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id TEXT,
  start_date DATE,
  end_date DATE,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id TEXT NOT NULL DEFAULT '000',
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ip_r_i ON info_publicity (tenant_id, run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_ip_run_date ON info_publicity (tenant_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ip_invited_id ON info_publicity (tenant_id, invited_id);

-- info_publicity_list
CREATE TABLE IF NOT EXISTS info_publicity_list (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id TEXT,
  start_date DATE,
  end_date DATE,
  data_type TEXT,
  handle_note TEXT,
  invite_name TEXT,
  list_id TEXT,
  rec_time TIMESTAMPTZ,
  rsp_type TEXT,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id TEXT NOT NULL DEFAULT '000',
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ipl_r_i ON info_publicity_list (tenant_id, run_date, invited_id, list_id);

-- publicity_info（代码中也使用此表，保留）
CREATE TABLE IF NOT EXISTS publicity_info (
  id BIGSERIAL PRIMARY KEY,
  run_date DATE,
  invited_id TEXT,
  start_date DATE,
  end_date DATE,
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS unique_r_i ON publicity_info (run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_pi_run_date ON publicity_info (run_date);
CREATE INDEX IF NOT EXISTS idx_pi_invited_id ON publicity_info (invited_id);
CREATE INDEX IF NOT EXISTS idx_publicty_tri ON publicity_info (tenant_id, run_date, invited_id);

-- settlement
CREATE TABLE IF NOT EXISTS settlement (
  id BIGSERIAL PRIMARY KEY,
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
  tenant_id TEXT NOT NULL DEFAULT '000',
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_se_a_m ON settlement (account_id, run_month);
CREATE INDEX IF NOT EXISTS idx_se_a ON settlement (account_id);
CREATE INDEX IF NOT EXISTS idx_se_m ON settlement (run_month);
CREATE INDEX IF NOT EXISTS idx_settlement_tr ON settlement (tenant_id, run_month);

-- settlement_detail
CREATE TABLE IF NOT EXISTS settlement_detail (
  id BIGSERIAL PRIMARY KEY,
  run_month TEXT,
  run_date DATE,
  account_id TEXT,
  account_name TEXT,
  ass_fee_sum TEXT,
  bu_sharing TEXT,
  la_sharing TEXT,
  res_fee_sum TEXT,
  total_revenue TEXT,
  update_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tenant_id TEXT NOT NULL DEFAULT '000',
  tenant_name TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_sd_tmda ON settlement_detail (tenant_id, run_month, run_date, account_id);

-- tenant
CREATE TABLE IF NOT EXISTS tenant (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  comment TEXT,
  create_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validate_date DATE NOT NULL DEFAULT '2050-12-31'
);

-- user
CREATE TABLE IF NOT EXISTS "user" (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  tenant_id TEXT NOT NULL DEFAULT '000'
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_user_phone ON "user" (phone);

-- user_tenant
CREATE TABLE IF NOT EXISTS user_tenant (
  id BIGSERIAL PRIMARY KEY,
  phone TEXT NOT NULL,
  tenant_id TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ut_pt ON user_tenant (phone, tenant_id);