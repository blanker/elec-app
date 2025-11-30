-- 注意：确保 CSV 的列与下方列清单一致，且日期为 YYYY-MM-DD

\copy account(id, name, tenant_id, update_time, tenant_name, credit_code) FROM 'C:\\data\\account.csv' WITH (FORMAT csv, HEADER true)

\copy bu_response_cap(account_id, account_name, agree_status, appeal_record, demand_no, good_res, list_id, punish_res, real_res, tenant_id, update_time, tenant_name) FROM 'C:\\data\\bu_response_cap.csv' WITH (FORMAT csv, HEADER true)

\copy customer(credit_code, name, id, tenant_id, tenant_name, update_time) FROM 'C:\\data\\customer.csv' WITH (FORMAT csv, HEADER true)

\copy daily_demand_market(account_id, run_date, capAbility, crtTime, electricityType, entityType, isEa, loads, loads_gen, loads_use, locateArea, maxRespLoad, maxResponceDur, maxResponcePow, maxValleyLoad, minRespLoad, minResponceDur, minResponcePow, minValleyLoad, resType, respTime, score, userState, voltLevel, voltagekV, "timestamp", col01, col02, tenant_id, update_time, tenant_name) FROM 'C:\\data\\daily_demand_market.csv' WITH (FORMAT csv, HEADER true)

\copy daily_demand_market_new(account_id, run_date, capAbility, crtTime, electricityType, entityType, isEa, loads, loads_gen, loads_use, locateArea, maxRespLoad, maxResponceDur, maxResponcePow, maxValleyLoad, minRespLoad, minResponceDur, minResponcePow, minValleyLoad, resType, respTime, score, userState, voltLevel, voltagekV, "timestamp", col01, col02, tenant_id, update_time, tenant_name) FROM 'C:\\data\\daily_demand_market_new.csv' WITH (FORMAT csv, HEADER true)

\copy info_publicity(run_date, invited_id, start_date, end_date, update_time, tenant_id, tenant_name) FROM 'C:\\data\\info_publicity.csv' WITH (FORMAT csv, HEADER true)

\copy info_publicity_list(run_date, invited_id, start_date, end_date, data_type, handle_note, invite_name, list_id, rec_time, rsp_type, update_time, tenant_id, tenant_name) FROM 'C:\\data\\info_publicity_list.csv' WITH (FORMAT csv, HEADER true)

\copy publicity_info(run_date, invited_id, start_date, end_date, tenant_id, update_time, tenant_name) FROM 'C:\\data\\publicity_info.csv' WITH (FORMAT csv, HEADER true)

\copy settlement(account_id, run_month, account_name, fee_sum, month_load, res_fee_sum, share_fee, share_price, ass_fee_sum, bu_sharing, la_sharing, gain_sharing, tenant_id, update_time, tenant_name) FROM 'C:\\data\\settlement.csv' WITH (FORMAT csv, HEADER true)

\copy settlement_detail(run_month, run_date, account_id, account_name, ass_fee_sum, bu_sharing, la_sharing, res_fee_sum, total_revenue, update_time, tenant_id, tenant_name) FROM 'C:\\data\\settlement_detail.csv' WITH (FORMAT csv, HEADER true)

\copy tenant(id, name, phone, comment, create_time, validate_date) FROM 'C:\\data\\tenant.csv' WITH (FORMAT csv, HEADER true)

\copy "user"(name, phone, password, salt, tenant_id) FROM 'C:\\data\\user.csv' WITH (FORMAT csv, HEADER true)

\copy user_tenant(phone, tenant_id) FROM 'C:\\data\\user_tenant.csv' WITH (FORMAT csv, HEADER true)