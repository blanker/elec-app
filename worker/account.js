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

export const getAccounts = async (request, env, context) => {

    try {
        const sql = `
    SELECT * FROM account ORDER BY id ASC
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
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