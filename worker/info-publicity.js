import { json } from 'itty-router' // ~1kB
import { timestampToDate} from './util'

export const saveInfoPublictiList = async (request, env, context) => {

    /**
{
  "beginTime": 1746720000000,
  "demandNo": "20250506-05-001-03",
  "hasEnforceSet": "N",
  "id": "6e98eef84be2b3e432f49c0685b94db0",
  "predictEndTime": 1747670400000,
  "runDay": 1746633600000
}

     */
    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        const sql = `
    INSERT INTO info_publicity (
    run_date,
    invited_id,
    start_date,
    end_date,
    tenant_id,
    tenant_name,
    update_time
    )
         VALUES (?,?,?,?, ?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(tenant_id, run_date, invited_id) DO UPDATE SET
        start_date=excluded.start_date,
        end_date=excluded.end_date,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data.rows) {
            await env.DB.prepare(sql)
                .bind(
                    timestampToDate(item.runDay),
                    item.demandNo,
                    timestampToDate(item.beginTime,true),
                    timestampToDate(item.predictEndTime,true),
                    tenant ?? null,
                    tenant_name ?? null
                )
                .run();
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};

export const saveInfoPublictiListList = async (request, env, context) => {

    /**
{
  "beginDate": 1746720000000,
  "dataType": "BUEFFECTPUB",
  "endDate": 1747670400000,
  "handleNote": "1",
  "inviteId": "20250506-05-001-03",
  "inviteName": "20250508邀约填谷",
  "listId": "LIST6df3ea5930274c4080c06d96d9b730ed",
  "recTime": 1746763939000,
  "rspType": "2",
  "runDay": 1746633600000
}

     */
    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        const sql = `
    INSERT INTO info_publicity_list (
    run_date,
    invited_id,
    start_date,
    end_date,
    data_type,
    handle_note,
    invite_name,
    list_id,
    rec_time,
    rsp_type,
    update_time,
    tenant_id,
    tenant_name
    )
         VALUES (?,?,?,?, ?,?,?,?, ?,?,CURRENT_TIMESTAMP, ?,?)
      ON CONFLICT(tenant_id, run_date, invited_id, list_id) DO UPDATE SET
        start_date=excluded.start_date,
        end_date=excluded.end_date,
        data_type=excluded.data_type,
        handle_note=excluded.handle_note,
        invite_name=excluded.invite_name,
        rec_time=excluded.rec_time,
        rsp_type=excluded.rsp_type,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data) {
            await env.DB.prepare(sql)
                .bind(
                    timestampToDate(item.runDay),
                    item.inviteId,
                    timestampToDate(item.beginDate,true),
                    timestampToDate(item.endDate,true),
                    item.dataType,
                    item.handleNote,
                    item.inviteName,
                    item.listId,
                    timestampToDate(item.recTime,true),
                    item.rspType,
                    tenant ?? null,
                    tenant_name ?? null
                )
                .run();
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};