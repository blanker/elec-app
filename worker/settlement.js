import { json } from 'itty-router' // ~1kB

export const saveSettlements = async (request, env, context) => {

    try {
        const { data } = await request.json();
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
     la_sharing
    )
         VALUES (?,?,?,?, ?,?,?,?, ?,?,?)
      ON CONFLICT(account_id, run_month) DO UPDATE SET
        account_name=excluded.account_name,
        fee_sum=excluded.fee_sum,
        month_load=excluded.month_load,
        res_fee_sum=excluded.res_fee_sum,
        share_fee=excluded.share_fee,
        share_price=excluded.share_price,
        ass_fee_sum=excluded.ass_fee_sum,
        bu_sharing=excluded.bu_sharing,
        la_sharing=excluded.la_sharing
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

            const { accountId, accountName, runMonth, feeSum, monthLoad, resFeeSum, shareFee, sharePrice, assFeeSum, buSharing, laSharing } = item;
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
                )
                .run();
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};

function formatTimestampToCST(timestamp) {
    // 东八区时间 = UTC 时间 + 8 小时
    const adjustedTimestamp = timestamp + 8 * 3600 * 1000;
    const date = new Date(adjustedTimestamp);

    // 获取 UTC 年、月（东八区时间已通过调整时间戳实现）
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');

    return `${year}-${month}`;
}