CREATE TABLE [account] (
    "id" text PRIMARY KEY,
    "name" text, 
    tenant_id text not null default '000', 
    update_time text NOT NULL default '2025-04-26 08:01:49', 
    tenant_name text, 
    credit_code text
);
CREATE INDEX idx_account_tenant ON account (tenant_id);

CREATE TABLE [bu_response_cap] (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    account_id text,      
    account_name text,      
    agree_status text,      
    appeal_record text,      
    demand_no text,      
    good_res text,      
    list_id text,      
    punish_res text,      
    real_res text , 
    tenant_id text not null default '000', 
    update_time text NOT NULL default '2025-04-26 08:01:49', 
    tenant_name text
    ) ;
CREATE UNIQUE INDEX unique_a_d_l ON bu_response_cap (account_id, demand_no, list_id) ;
CREATE INDEX idx_brc_account_id ON bu_response_cap (account_id)                      ;
CREATE INDEX idx_bu_tda ON bu_response_cap(tenant_id, demand_no, account_id)     ;

CREATE TABLE customer (     
    "credit_code" text NOT NULL PRIMARY KEY,     
    "name" text,    
     "id" text,     
     "tenant_id" text,     
     "tenant_name" text,    
      "update_time" text NOT NULL DEFAULT CURRENT_TIMESTAMP ) ;

CREATE TABLE "daily_demand_market"  (     
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

CREATE UNIQUE INDEX unique_email_phone ON "daily_demand_market" (account_id, run_date) │
CREATE INDEX idx_ddm_run_date ON "daily_demand_market"(run_date)                       │
CREATE INDEX idx_daily_tr ON "daily_demand_market"(tenant_id, run_date)      

 CREATE TABLE "daily_demand_market_new"  (                     
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
     )  ;

CREATE UNIQUE INDEX unique_email_phone_1 ON "daily_demand_market_new" (account_id, run_date) 

CREATE TABLE info_publicity (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    run_date text,     
    invited_id text,     
    start_date text,     
    end_date text,     
    update_time text NOT NULL default CURRENT_TIMESTAMP,     
    tenant_id text not null default '000',     
tenant_name text
 );

CREATE UNIQUE INDEX uk_ip_r_i ON info_publicity (tenant_id, run_date, invited_id) ;
CREATE INDEX idx_ip_run_date ON info_publicity(tenant_id, run_date)               ;
CREATE INDEX idx_ip_invited_id ON info_publicity(tenant_id, invited_id)    ;

 CREATE TABLE info_publicity_list (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    run_date text,     
    invited_id text,     
    start_date text,     
    end_date text,     
    data_type text,     
    handle_note text,     
    invite_name text,     
    list_id text,     
    rec_time text,     
    rsp_type text,     
    update_time text NOT NULL default CURRENT_TIMESTAMP,     
    tenant_id text not null default '000',     
    tenant_name text 
    );
CREATE UNIQUE INDEX uk_ipl_r_i ON info_publicity_list (tenant_id, run_date, invited_id, list_id) ;

CREATE TABLE publicity_info (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    run_date text,     
    invited_id text,     
    start_date text,     
    end_date text , 
    tenant_id text not null default '000', 
    update_time text NOT NULL default '2025-04-26 08:01:49', 
    tenant_name text
) ;

CREATE UNIQUE INDEX unique_r_i ON publicity_info (run_date, invited_id)        ;
CREATE INDEX idx_pi_run_date ON publicity_info(run_date)                      ;
CREATE INDEX idx_pi_invited_id ON publicity_info(invited_id)                   ;
CREATE INDEX idx_publicty_tri ON publicity_info(tenant_id,run_date,invited_id) ;

CREATE TABLE settlement (     
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
    la_sharing TEXT     , 
    gain_sharing TEXT, 
    tenant_id text not null default '000', 
    update_time text NOT NULL default '2025-04-26 08:01:49', 
    tenant_name text) ;

CREATE UNIQUE INDEX uk_se_a_m ON settlement (account_id, run_month) ;
CREATE INDEX idx_se_a ON settlement (account_id)                    ;
CREATE INDEX idx_se_m ON settlement ( run_month)                    ;
CREATE INDEX idx_settlement_tr ON settlement(tenant_id, run_month)   ;

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
    tenant_name text );
CREATE UNIQUE INDEX uk_sd_tmda ON settlement_detail (tenant_id, run_month, run_date, account_id);

CREATE TABLE tenant (     
    "id" text NOT NULL PRIMARY KEY,     
    "name" text NOT NULL,     
    "phone" text,     
    "comment" text,     
    "create_time" text NOT NULL DEFAULT CURRENT_TIMESTAMP,     
    "validate_date" text NOT NULL DEFAULT '2050-12-31' 
    ) ;


CREATE TABLE user (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    name text NOT NULL,     
    phone text NOT NULL,     
    password text NOT NULL,     
    salt text NOT NULL , 
    tenant_id text not null default '000'
    );    
CREATE UNIQUE INDEX uk_user_phone ON user (phone) ;

 CREATE TABLE user_tenant (     
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,     
    phone text not null,     
    tenant_id text not null 
);    
CREATE UNIQUE INDEX uk_ut_pt ON user_tenant (phone, tenant_id);