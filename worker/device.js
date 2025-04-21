import { json } from 'itty-router' // ~1kB

export const saveDevices = async (request, env, context) => {

    try {
        const { data } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        const sql = `
    INSERT INTO device (id, hall, region, category, name)
         VALUES (?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
        hall=excluded.hall,
        region=excluded.region,
        category=excluded.category,
        name=excluded.name
    `
        console.log('sql: ', sql);
        for (const item of data) {
            await env.DB.prepare(sql)
                .bind(item.id, item.hall, item.region, item.category, item.name)
                .run();
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
}