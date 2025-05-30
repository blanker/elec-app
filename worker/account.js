import { json } from 'itty-router' // ~1kB

export const saveAccounts = async (request, env, context) => {

    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
        "account": "楚雄移动展厅",
        "name": "f",
        }*/
        const sql = `
    INSERT INTO account (id, name, tenant_id, tenant_name, update_time)
         VALUES (?,?, ?, ?,CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        tenant_id=excluded.tenant_id,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        for (const item of data) {
            await env.DB.prepare(sql)
                .bind(
                    item.account,
                    item.name,
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
export const saveAccountAgent = async (request, env, context) => {

    try {
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
{
  "begintime": 1737604580000,
  "buType": "被代理用户",
  "capAbility": "2850",
  "creditCode": "91530381MA7H78C600",
  "gainSharing": 20,
  "id": "0502053202933855",
  "isEa": "N",
  "isQa": "Y",
  "locateArea": "050200",
  "marketState": "运行",
  "maxRespLoad": 1250,
  "maxResponcePow": "1250",
  "maxValleyLoad": 800,
  "minRespLoad": 0,
  "minResponcePow": "0",
  "minValleyLoad": 0,
  "name": "宣威市昌能新能源汽车服务有限公司",
  "resType": "电动汽车负荷",
  "voltLevel": "交流10kV",
  "voltagekV": 0
}
        }*/
        const sql = `
    INSERT INTO account (id, name, tenant_id, tenant_name, update_time, credit_code)
         VALUES (?,?, ?, ?,CURRENT_TIMESTAMP, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        tenant_id=excluded.tenant_id,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time,
        credit_code=excluded.credit_code
    `
        console.log('sql: ', sql);
        for (const item of data.rows) {
            await env.DB.prepare(sql)
                .bind(
                    item.id,
                    item.name,
                    tenant ?? null,
                    tenant_name ?? null,
                    item.creditCode ?? null,
                )
                .run();
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};

export const getAccounts = async (request, env, context) => {
    console.log('getAccounts', request.user);
    try {
        const sql = `
    SELECT * 
      FROM account 
    WHERE tenant_id = ?
    ORDER BY id ASC
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