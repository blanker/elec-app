import { json } from 'itty-router' // ~1kB

export const saveCustomer = async (request, env, context) => {

    try {
        // "data": {
        //   "creditCode": "91440101MA5D693M4Q",
        //   "id": "33530154",
        //   "name": "广东万嘉售电有限公司"
        // },
        const { data, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        if (!data.creditCode) {
            return json({ success: false, error: 'no credit code' });
        }

        const sql = `
    INSERT INTO customer (id, name, credit_code, tenant_id, tenant_name, update_time)
         VALUES (?,?,?, ?,?, CURRENT_TIMESTAMP)
      ON CONFLICT(credit_code) DO UPDATE SET
        id=excluded.id,
        name=excluded.name,
        tenant_id=excluded.tenant_id,
        tenant_name=excluded.tenant_name,
        update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        await env.DB.prepare(sql)
            .bind(
                data.id ?? null,
                data.name ?? null,
                data.creditCode,
                tenant ?? null,
                tenant_name ?? null
            )
            .run();

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};

