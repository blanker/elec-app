-- 1. 创建主表（分区父表）
drop table IF EXISTS daily_demand_market;
CREATE TABLE IF NOT EXISTS daily_demand_market (
    id BIGSERIAL,
    account_id varchar(100) NOT NULL,
    run_date DATE NOT NULL,
    capability text,
    crttime integer,
    electricitytype text,
    entitytype text,
    isea text,
    loads  text,
    loads_gen text,
    loads_use text,
    locatearea text,
    maxrespload varchar(100),
    maxresponcedur text,
    maxresponcepow text,
    maxvalleyload varchar(100),
    minrespload varchar(100),
    minresponcedur text,
    minresponcepow text,
    minvalleyload varchar(100),
    restype text,
    resptime text,
    score text,
    userstate text,
    voltlevel text,
    voltagekv varchar(100),
    "timestamp" varchar(100),
    col01 text,
    col02 text  ,
    tenant_id text not null default '000',
    update_time text NOT NULL default '2025-04-26 08:01:49',
    tenant_name text,       
    PRIMARY KEY (account_id, run_date)
) PARTITION BY RANGE (run_date);

CREATE TABLE daily_demand_market_2501
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE daily_demand_market_2502
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE daily_demand_market_2503
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE daily_demand_market_2504
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE daily_demand_market_2505
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE daily_demand_market_2506
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE daily_demand_market_2507
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');    
CREATE TABLE daily_demand_market_2508
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');    
CREATE TABLE daily_demand_market_2509
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');    
CREATE TABLE daily_demand_market_2510
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');    
CREATE TABLE daily_demand_market_2511
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');    
CREATE TABLE daily_demand_market_2512
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
CREATE TABLE daily_demand_market_2601
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE daily_demand_market_2602
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE daily_demand_market_2603
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE daily_demand_market_2604
    PARTITION OF daily_demand_market
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
        
-- default partition
CREATE TABLE daily_demand_market_default
    PARTITION OF daily_demand_market
    DEFAULT;
        


insert into daily_demand_market 
(
account_id ,
    run_date ,
    capAbility ,
    crtTime,
    electricityType ,
    entityType ,
    isEa,
    loads  ,
    loads_gen ,
    loads_use,
    locateArea ,
    maxRespLoad ,
    maxResponceDur ,
    maxResponcePow,
    maxValleyLoad ,
    minRespLoad ,
    minResponceDur ,
    minResponcePow ,
    minValleyLoad ,
    resType ,
    respTime ,
    score ,
    userState ,
    voltLevel ,
    voltagekV,
    "timestamp" ,
    "col01" ,
    "col02"   ,
    tenant_id ,
    update_time ,
    tenant_name
    )
select 
account_id ,
    run_date ,
    capAbility ,
    crtTime,
    electricityType ,
    entityType ,
    isEa,
    loads  ,
    loads_gen ,
    loads_use,
    locateArea ,
    maxRespLoad ,
    maxResponceDur ,
    maxResponcePow,
    maxValleyLoad ,
    minRespLoad ,
    minResponceDur ,
    minResponcePow ,
    minValleyLoad ,
    resType ,
    respTime ,
    score ,
    userState ,
    voltLevel ,
    voltagekV,
    "timestamp" ,
    "col01" ,
    "col02"   ,
    tenant_id ,
    update_time ,
    tenant_name
     from daily_demand_market_202511;  