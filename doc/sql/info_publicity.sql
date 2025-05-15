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

CREATE UNIQUE INDEX uk_ip_r_i ON info_publicity (tenant_id, run_date, invited_id);
CREATE INDEX IF NOT EXISTS idx_ip_run_date ON info_publicity(tenant_id, run_date);
CREATE INDEX IF NOT EXISTS idx_ip_invited_id ON info_publicity(tenant_id, invited_id);

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

CREATE UNIQUE INDEX uk_ipl_r_i ON info_publicity_list (tenant_id, run_date, invited_id, list_id);

