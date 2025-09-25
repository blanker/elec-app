import { json } from 'itty-router' // ~1kB

export const saveSettlements = async (request, env, context) => {

    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
        "account": "楚雄移动展厅",
        "name": "f",
        }*/
        const sql = `
    INSERT INTO settlement (
     account_id, 
     run_month, 
     account_name, 
     fee_sum, 

     month_load, 
     res_fee_sum, 
     share_fee, 
     share_price,

     ass_fee_sum,
     bu_sharing,
     la_sharing,
     gain_sharing,

     tenant_id, 
     tenant_name,
     update_time
    )
         VALUES (?,?,?,?, ?,?,?,?, ?,?,?,?, ?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(account_id, run_month) DO UPDATE SET
        account_name=excluded.account_name,
        fee_sum=excluded.fee_sum,
        month_load=excluded.month_load,
        res_fee_sum=excluded.res_fee_sum,
        share_fee=excluded.share_fee,
        share_price=excluded.share_price,
        ass_fee_sum=excluded.ass_fee_sum,
        bu_sharing=excluded.bu_sharing,
        la_sharing=excluded.la_sharing,
        gain_sharing=excluded.gain_sharing,
        tenant_id=excluded.tenant_id,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data.rows) {
            // "accountId": "0501001700001962",
            // "accountName": "昆明佩升商贸有限公司",
            // "feeSum": "-6.81",
            // "monthLoad": "30157",
            // "resFeeSum": "0",
            // "runMonth": 1659283200000,
            // "shareFee": "6.81",
            // "sharePrice": "0.0002259265"
            // assFeeSum: "0"
            // buSharing: "-39.36"
            // laSharing:"0"
            // gainSharing:"0"

            const { accountId, accountName, runMonth, feeSum, monthLoad, resFeeSum, shareFee, sharePrice, assFeeSum, buSharing, laSharing, gainSharing } = item;
            // 把时间戳runMonth转换为东八区的YYYY-MM格式
            const month = formatTimestampToCST(runMonth);

            await env.DB.prepare(sql)
                .bind(
                    accountId,
                    month,
                    accountName ?? null,
                    feeSum ?? null,
                    monthLoad ?? null,
                    resFeeSum ?? null,
                    shareFee ?? null,
                    sharePrice ?? null,
                    assFeeSum ?? null,
                    buSharing ?? null,
                    laSharing ?? null,
                    gainSharing ?? null,
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

export const saveSettlementDetail = async (request, env, context) => {

    try {
        const { data, tenant, tenant_name, extra } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
        "account": "楚雄移动展厅",
        "name": "f",
        }*/
        const sql = `
    INSERT INTO settlement_detail (
     run_month, 
     run_date, 
     account_id, 
     account_name, 

     ass_fee_sum, 
     bu_sharing, 
     la_sharing, 
     res_fee_sum,

     total_revenue,
     tenant_id, 
     tenant_name,
     update_time
    )
         VALUES (?,?,?,?, ?,?,?,?, ?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(tenant_id, run_month, run_date, account_id) DO UPDATE SET
        account_name=excluded.account_name,
        ass_fee_sum=excluded.ass_fee_sum,
        bu_sharing=excluded.bu_sharing,
        la_sharing=excluded.la_sharing,
        res_fee_sum=excluded.res_fee_sum,
        total_revenue=excluded.total_revenue,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data.rows) {
            // "accountId": "0501001700001962",
            // "accountName": "昆明佩升商贸有限公司",
            // "feeSum": "-6.81",
            // "monthLoad": "30157",
            // "resFeeSum": "0",
            // "runMonth": 1659283200000,
            // "shareFee": "6.81",
            // "sharePrice": "0.0002259265"
            // assFeeSum: "0"
            // buSharing: "-39.36"
            // laSharing:"0"
            // gainSharing:"0"

            const { accountId, accountName, assFeeSum, buSharing, laSharing, resFeeSum, runDay, totalRevenue} = item;
            // 把时间戳runMonth转换为东八区的YYYY-MM格式
            const day = formatTimestampToCSTDay(runDay);
            
            const month = extra.runMonth ?? formatTimestampToCST(runDay);

            await env.DB.prepare(sql)
                .bind(
                    month,
                    day,
                    accountId ?? null,
                    accountName ?? null,
                    assFeeSum ?? null,
                    buSharing ?? null,
                    laSharing ?? null,
                    resFeeSum ?? null,
                    totalRevenue ?? null,
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

export async function countByMonth(request, env, context) {
    console.log('countByMonth', request.user);
    try {
        const sql = `
    SELECT run_month,count(*) cnt
      FROM settlement 
     WHERE tenant_id = ?
     GROUP BY run_month
     ORDER BY run_month
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
        console.error("Error query data:", error);
        return json({ success: false, error: error.message });
    }

}

export async function fetchByMonth(request, env, context) {
    console.log('countByMonth', request.user);
    const { data } = await request.json();
    try {
        const sql = `
    SELECT *
      FROM settlement 
     WHERE tenant_id = ?
       AND run_month = ?
     ORDER BY account_id
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id, data.date)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error query data:", error);
        return json({ success: false, error: error.message });
    }

}
export async function fetchDetailByMonth(request, env, context) {
    console.log('fetchDetailByMonth', request.user);
    const { data } = await request.json();
    try {
        const sql = `
    SELECT *
      FROM settlement_detail 
     WHERE tenant_id = ?
       AND run_month = ?
     ORDER BY account_id, run_date
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(request?.user?.tenant?.id, data.date)
            .run();

        return json({
            success: true,
            data: result.results,
        });
    } catch (error) {
        console.error("Error query data:", error);
        return json({ success: false, error: error.message });
    }

}

function formatTimestampToCST(timestamp) {
    // 东八区时间 = UTC 时间 + 8 小时
    const adjustedTimestamp = timestamp + 8 * 3600 * 1000;
    const date = new Date(adjustedTimestamp);

    // 获取 UTC 年、月（东八区时间已通过调整时间戳实现）
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');

    return `${year}-${month}`;
}

function formatTimestampToCSTDay(timestamp) {
    // 东八区时间 = UTC 时间 + 8 小时
    const adjustedTimestamp = timestamp + 8 * 3600 * 1000;
    const date = new Date(adjustedTimestamp);

    // 获取 UTC 年、月（东八区时间已通过调整时间戳实现）
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate()).toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}