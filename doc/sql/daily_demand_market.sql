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

select tenant_id, run_date,count(*) from daily_demand_market_new group by tenant_id, run_date;
select tenant_id, run_date,count(*) from daily_demand_market group by tenant_id, run_date;


UPDATE sqlite_sequence 
SET seq = 99546 
WHERE name = 'daily_demand_market';

insert into daily_demand_market_new (
    "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name"
) select "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name" 
  from daily_demand_market 
where tenant_id = '91440101MA5D693M4Q' and run_date in (
     '2025-04-21',     '2025-04-26',     '2025-04-27',     '2025-05-08',     '2025-05-30',     '2025-05-31',     '2025-06-01',     '2025-06-02',     '2025-06-04',     '2025-06-05',     '2025-06-06',     '2025-06-07','2025-06-08','2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13','2025-06-14','2025-06-15','2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20','2025-06-21','2025-06-22'
    );
delete from daily_demand_market 
where tenant_id = '91440101MA5D693M4Q' and run_date in (
     '2025-04-21',     '2025-04-26',     '2025-04-27',     '2025-05-08',     '2025-05-30',     '2025-05-31',     '2025-06-01',     '2025-06-02',     '2025-06-04',     '2025-06-05',     '2025-06-06',     '2025-06-07','2025-06-08','2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13','2025-06-14','2025-06-15','2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20','2025-06-21','2025-06-22'
    );    

insert into daily_demand_market_new (
    "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name"
) select "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name" 
  from daily_demand_market 
where tenant_id = '91530112MA6NUXXJ8N' and run_date in (
     '2025-04-21',     '2025-04-26',     '2025-04-27',     '2025-05-08',     '2025-05-30',     '2025-05-31',     '2025-06-01',     '2025-06-02',     '2025-06-04',     '2025-06-05',     '2025-06-06',     '2025-06-07','2025-06-08','2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13','2025-06-14','2025-06-15','2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20','2025-06-21','2025-06-22'
    );

  delete from daily_demand_market 
where tenant_id = '91530112MA6NUXXJ8N' and run_date in (
     '2025-04-21',     '2025-04-26',     '2025-04-27',     '2025-05-08',     '2025-05-30',     '2025-05-31',     '2025-06-01',     '2025-06-02',     '2025-06-04',     '2025-06-05',     '2025-06-06',     '2025-06-07','2025-06-08','2025-06-09','2025-06-10','2025-06-11','2025-06-12','2025-06-13','2025-06-14','2025-06-15','2025-06-16','2025-06-17','2025-06-18','2025-06-19','2025-06-20','2025-06-21','2025-06-22'
    );    

insert into daily_demand_market_new (
    "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name"
) select "account_id" ,     "run_date" ,     "capAbility" ,     "crtTime" ,     "electricityType" ,    "entityType" ,     "isEa" ,    "loads"  ,    "loads_gen" ,      "loads_use" ,      "locateArea" ,      "maxRespLoad" ,      "maxResponceDur" ,     "maxResponcePow" ,      "maxValleyLoad" ,      "minRespLoad" ,      "minResponceDur" ,     "minResponcePow" ,     "minValleyLoad" ,     "resType" ,      "respTime" ,      "score" ,      "userState" ,     "voltLevel" ,      "voltagekV" ,     "timestamp" ,     "col01" ,      "col02"   ,     "tenant_id" ,     "update_time" ,     "tenant_name" 
  from daily_demand_market 
where tenant_id in ('91530112MA6NUXXJ8N','91440101MA5D693M4Q') and run_date in (
         '2025-06-23',     '2025-06-24',     '2025-06-25',     '2025-06-26',     '2025-06-27',     '2025-06-28','2025-06-29','2025-06-30'
    );    

delete from daily_demand_market 
where tenant_id in ('91530112MA6NUXXJ8N','91440101MA5D693M4Q') and run_date in (
         '2025-06-23',     '2025-06-24',     '2025-06-25',     '2025-06-26',     '2025-06-27',     '2025-06-28','2025-06-29','2025-06-30'
    );    
