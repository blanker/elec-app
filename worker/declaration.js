import { json } from 'itty-router' // ~1kB

export const saveDeclaration = async (request, env, context) => {
    try {
        const { data, extra, tenant, tenant_name } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        if (!extra.run_date) {
            return json({ success: true, name: 'NO RUN_DATE' });
        }
        if (!data.loads_use) {
            return json({ success: true, name: 'NO loads use' });
        }
        const sql = `
INSERT INTO daily_demand_market (
account_id,
run_date,

capAbility,
crtTime,
electricityType,
entityType,
isEa,

loads,
loads_gen,
loads_use,
locateArea,
maxRespLoad,

maxResponceDur,
maxResponcePow,
maxValleyLoad,
minRespLoad,
minResponceDur,

minResponcePow,
minValleyLoad,
resType,
respTime,
score,

userState,
voltLevel,
voltagekV,

tenant_id, 
tenant_name,

update_time

)
         VALUES (
         ?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?,
         ?,?, CURRENT_TIMESTAMP
        )
      ON CONFLICT(account_id, run_date) DO UPDATE SET
        capAbility=excluded.capAbility,
crtTime=excluded.crtTime,
electricityType=excluded.electricityType,
entityType=excluded.entityType,
isEa=excluded.isEa,
loads=excluded.loads,
loads_gen=excluded.loads_gen,
loads_use=excluded.loads_use,
locateArea=excluded.locateArea,
maxRespLoad=excluded.maxRespLoad,
maxResponceDur=excluded.maxResponceDur,
maxResponcePow=excluded.maxResponcePow,
maxValleyLoad=excluded.maxValleyLoad,
minRespLoad=excluded.minRespLoad,
minResponceDur=excluded.minResponceDur,
minResponcePow=excluded.minResponcePow,
minValleyLoad=excluded.minValleyLoad,
resType=excluded.resType,
respTime=excluded.respTime,
score=excluded.score,
userState=excluded.userState,
voltLevel=excluded.voltLevel,
voltagekV=excluded.voltagekV,
tenant_id=excluded.tenant_id,
tenant_name=excluded.tenant_name,
update_time=excluded.update_time
    `
        console.log('sql: ', sql);
        const {
            id,
            capAbility,
            crtTime,
            electricityType,
            entityType,
            isEa,
            loads,
            loads_gen,
            loads_use,
            locateArea,
            maxRespLoad,
            maxResponceDur,
            maxResponcePow,
            maxValleyLoad,
            minRespLoad,
            minResponceDur,
            minResponcePow,
            minValleyLoad,
            resType,
            respTime,
            score,
            userState,
            voltLevel,
            voltagekV } = data;

        console.log('data', {
            id,
            capAbility,
            crtTime,
            electricityType,
            entityType,
            isEa,
            loads,
            loads_gen,
            loads_use,
            locateArea,
            maxRespLoad,
            maxResponceDur,
            maxResponcePow,
            maxValleyLoad,
            minRespLoad,
            minResponceDur,
            minResponcePow,
            minValleyLoad,
            resType,
            respTime,
            score,
            userState,
            voltLevel,
            voltagekV,

            tenant
        });

        await env.DB.prepare(sql)
            .bind(
                id,
                extra.run_date,
                capAbility ?? null,
                crtTime ?? null,
                electricityType ?? null,
                entityType ?? null,
                isEa ?? null,
                loads ? JSON.stringify(loads) : null,
                loads_gen ? JSON.stringify(loads_gen) : null,
                loads_use ? JSON.stringify(loads_use) : null,
                locateArea ?? null,
                maxRespLoad ?? null,
                maxResponceDur ?? null,
                maxResponcePow ?? null,
                maxValleyLoad ?? null,
                minRespLoad ?? null,
                minResponceDur ?? null,
                minResponcePow ?? null,
                minValleyLoad ?? null,
                resType ?? null,
                respTime ?? null,
                score ?? null,
                userState ?? null,
                voltLevel ?? null,
                voltagekV ?? null,
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

export const statDeclarationRundates = async (request, env, context) => {
    console.log('statDeclarationRundates', request.user);
    try {
        const sql = `
    SELECT run_date, count(*) as cnt 
      FROM daily_demand_market
     WHERE tenant_id = ?
     GROUP BY run_date 
     ORDER BY run_date ASC
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

export const getDeclarationsByRundate = async (request, env, context) => {
    console.log('statDeclarationRundates', request.user);
    const { run_date } = await request.json();
    try {
        const sql = `
    SELECT * FROM daily_demand_market 
     WHERE tenant_id =?
       AND run_date = ?
     ORDER BY account_id ASC
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