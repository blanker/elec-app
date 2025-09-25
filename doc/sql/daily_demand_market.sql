CREATE TABLE [daily_demand_market]  (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "account_id" text, 
    "run_date" text, 
    "capAbility" text, 
    "crtTime" integer, 
    "electricityType" text, 
    "entityType" text, 
    "isEa" text,
    "loads"  text,
    "loads_gen" text,  
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
    "col02" text  , 
    tenant_id text not null default '000', 
    update_time text NOT NULL default '2025-04-26 08:01:49', 
    tenant_name text
    );

CREATE UNIQUE INDEX unique_email_phone ON daily_demand_market (account_id, run_date);
CREATE INDEX idx_ddm_run_date ON daily_demand_market(run_date);
CREATE INDEX idx_daily_tr ON daily_demand_market(tenant_id, run_date);

ALTER TABLE daily_demand_market RENAME TO daily_demand_market_backup;
ALTER TABLE daily_demand_market RENAME TO daily_demand_market_new;
ALTER TABLE daily_demand_market_backup RENAME TO daily_demand_market;



UPDATE sqlite_sequence 
SET seq = 99546 
WHERE name = 'daily_demand_market';