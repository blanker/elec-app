import { json } from 'itty-router' // ~1kB

export const getTenant = async (request, env, context) => {
    console.log('getTenant', request.user);
    try {
        const sql = `
    SELECT * 
      FROM tenant 
    ORDER BY id ASC
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