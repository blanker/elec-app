import { json } from 'itty-router' // ~1kB

export const saveAccounts = async (request, env, context) => {

    try {
        const { data } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
        "account": "楚雄移动展厅",
        "name": "f",
        }*/
        const sql = `
    INSERT INTO account (id, name)
         VALUES (?,?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name
    `
        console.log('sql: ', sql);
        for (const item of data) {
            await env.DB.prepare(sql)
                .bind(item.account, item.name)
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