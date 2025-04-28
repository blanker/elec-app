import { json } from 'itty-router' // ~1kB

export const saveResponses = async (request, env, context) => {
    try {
        // {
        //   "rows": [
        //     {
        //       "accountId": "0501001700001962",
        //       "accountName": "昆明佩升商贸有限公司",
        //       "agreeStatus": "未确认",
        //       "appealRecord": "0",
        //       "demandNo": "20250414-05-002-03",
        //       "goodRes": "0",
        //       "listId": "LISTe3a828a417c8475d8c38be869664cd5a",
        //       "punishRes": "0",
        //       "realRes": "-30"
        //     }
        //   ],
        //     "total": 1
        // }
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        const sql = `
      INSERT INTO bu_response_cap (
      account_id, account_name, agree_status, 
      appeal_record, demand_no, good_res, 
      list_id, punish_res, real_res,
        tenant_id, tenant_name, update_time
      )
           VALUES (?,?,?,  ?,?,?,  ?,?,?, ?,?, CURRENT_TIMESTAMP)
        ON CONFLICT(account_id, demand_no, list_id) DO UPDATE SET
          account_name=excluded.account_name,
          agree_status=excluded.agree_status,
          appeal_record=excluded.appeal_record,
          good_res=excluded.good_res,
          punish_res=excluded.punish_res,
          real_res=excluded.real_res,
          tenant_id=excluded.tenant_id,
          tenant_name=excluded.tenant_name,
          update_time=excluded.update_time
      `;
        console.log('sql: ', sql);
        for (const item of data.rows) {
            const { accountId, accountName, agreeStatus, appealRecord, demandNo, goodRes, listId, punishRes, realRes } = item;

            await env.DB.prepare(sql)
                .bind(
                    accountId,
                    accountName ?? null,
                    agreeStatus ?? null,
                    appealRecord ?? null,
                    demandNo ?? null,
                    goodRes ?? null,
                    listId ?? null,
                    punishRes ?? null,
                    realRes ?? null,
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

export async function getPublicityInfoList(request, env, context) {
    console.log('getPublicityInfoList', request.user);
    try {
        const sql = `
    SELECT * 
      FROM publicity_info
     WHERE tenant_id = ?
     GROUP BY run_date, invited_id
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

}

export const statResponses = async (request, env, context) => {
    console.log('statResponses', request.user);
    try {
        const sql = `
    SELECT account_id, demand_no, count(*) as cnt 
      FROM bu_response_cap
     WHERE tenant_id =?
    GROUP BY account_id, demand_no
    ORDER BY demand_no DESC, account_id ASC
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

};

export const statResponseGroupByRundate = async (request, env, context) => {
    console.log('statResponseGroupByRundate', request.user);
    try {
        const sql = `
SELECT pi.run_date
      ,count(*) as total
      ,count(distinct brc.account_id) as account_cnt
 FROM bu_response_cap brc
    , publicity_info pi 
WHERE brc.demand_no = pi.invited_id 
  AND brc.tenant_id = pi.tenant_id
  AND brc.tenant_id =?
GROUP BY run_date 
ORDER BY run_date ASC;
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

};

export const savePublicityInfoList = async (request, env, context) => {

    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        const sql = `
    INSERT INTO publicity_info (
    run_date, invited_id, start_date, end_date, 
    tenant_id, tenant_name, update_time)
         VALUES (?,?,?,?, ?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(run_date, invited_id) DO UPDATE SET
        start_date=excluded.start_date,
        end_date=excluded.end_date,
        tenant_id=excluded.tenant_id,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data) {
            await env.DB.prepare(sql)
                .bind(
                    item.run_date,
                    item.invited_id,
                    item.start_date,
                    item.end_date,
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

export const getResponsesByRundate = async (request, env, context) => {
    console.log('statResponseGroupByRundate', request.user);

    const { run_date } = await request.json();
    try {
        const sql = `
SELECT brc.*
  FROM bu_response_cap brc, publicity_info pi
WHERE brc.demand_no = pi.invited_id
  AND brc.tenant_id = pi.tenant_id
  AND brc.tenant_id =?
  AND pi.run_date = ?
ORDER BY brc.account_id ASC;
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id, run_date)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

};