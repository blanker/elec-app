import { AutoRouter, cors, json } from 'itty-router' // ~1kB

const { preflight, corsify } = cors({
  origin: '*',
  // origin: true,
  // origin: 'https://foo.bar',
  // origin: ['https://foo.bar', 'https://dog.cat'],
  // origin: /oo.bar$/,
  // origin: (origin) => origin.endsWith('foo.bar') ? origin : undefined,
  // credentials: true,
  allowMethods: '*',
  // allowMethods: 'GET, POST',
  // allowMethods: ['GET', 'POST'],
  // allowHeaders: 'x-foo, x-bar',
  allowHeaders: ['content-type', 'x-bar'],
  // exposeHeaders: 'x-foo, x-bar',
  // exposeHeaders: ['x-foo', 'x-bar'],
  maxAge: 84600,
})
const router = AutoRouter({
  before: [preflight],  // add preflight upstream
  finally: [corsify],   // and corsify downstream
})

router
  .get('/api/hello/:name', ({ name }) => `Hello, ${name}!`)
  .get('/api/json', () => json({ name: 'json' }))
  .get('/api', () => json({ name: 'gogo' }))
  .get('/api/promises', () => Promise.resolve('foo'))

router.post('/api/foo', (request, env, context) => new Response(JSON.stringify({ foo: 'bar' }), {
  headers: { 'Content-Type': 'application/json' },
}));

router.post('/api/table-device/', async (request, env, context) => {

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
});

router.post('/api/table-hall/', async (request, env, context) => {

  try {
    const { data } = await request.json();
    console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
    /* {
    "Name": "楚雄移动展厅",
    "Deleted": "f",
    "CreatedBy": "10",
    "CreatedAt": "2025-03-24 07:03:37.908977",
    "Address": "楚雄市",
    "Id": "8"
    }*/
    const sql = `
    INSERT INTO hall (id, name, deleted, created_by, created_at, address)
         VALUES (?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        deleted=excluded.deleted,
        created_by=excluded.created_by,
        created_at=excluded.created_at,
        address=excluded.address
    `
    console.log('sql: ', sql);
    for (const item of data) {
      await env.DB.prepare(sql)
        .bind(item.Id, item.Name, item.Deleted, item.CreatedBy, item.CreatedAt, item.Address)
        .run();
    }

  } catch (error) {
    console.error("Error inserting data:", error);
    return json({ success: false, error: error.message });
  }

  return json({ success: true, name: 'ok' });
});

router.post('/api/table-data/daily-demand-market/', async (request, env, context) => {
  try {
    const { data, extra } = await request.json();
    console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
    if (!extra.run_date) {
      return json({ success: true, name: 'NO RUN_DATE' });
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
voltagekV
)
         VALUES (
         ?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?,?,?,
         ?,?,?
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
voltagekV=excluded.voltagekV
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
      voltagekV
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
        voltagekV ?? null
      )
      .run();
  } catch (error) {
    console.error("Error inserting data:", error);
    return json({ success: false, error: error.message });
  }

  return json({ success: true, name: 'ok' });
});

router.post('/api/table-data/bu-response-cap', async (request, env, context) => {
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
    const { data } = await request.json();
    console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
    const sql = `
      INSERT INTO bu_response_cap (account_id, account_name, agree_status, appeal_record, demand_no, good_res, list_id, punish_res, real_res)
           VALUES (?,?,?,?,?,?,?,?,?)
        ON CONFLICT(account_id, demand_no, list_id) DO UPDATE SET
          account_name=excluded.account_name,
          agree_status=excluded.agree_status,
          appeal_record=excluded.appeal_record,
          good_res=excluded.good_res,
          punish_res=excluded.punish_res,
          real_res=excluded.real_res
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
          realRes ?? null
        )
        .run();
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    return json({ success: false, error: error.message });
  }
  return json({ success: true, name: 'ok' });
});

router.post('/api/table-data/account', async (request, env, context) => {

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
});

router.post('/api/accounts', async (request, env, context) => {

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

});

router.post('/api/rundates', async (request, env, context) => {

  try {
    const sql = `
    SELECT run_date, count(*) as cnt FROM daily_demand_market GROUP BY run_date ORDER BY run_date ASC
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

});

router.post('/api/rundate-data', async (request, env, context) => {
  const { run_date } = await request.json();
  try {
    const sql = `
    SELECT * FROM daily_demand_market 
     WHERE run_date = ?
     ORDER BY account_id ASC
    `
    console.log('sql: ', sql);
    const result = await env.DB.prepare(sql)
      .bind(run_date)
      .run();

    return json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return json({ success: false, error: error.message });
  }

});

router.post('/api/responses', async (request, env, context) => {

  try {
    const sql = `
    SELECT account_id, demand_no, count(*) as cnt 
      FROM bu_response_cap 
    GROUP BY account_id, demand_no
    ORDER BY demand_no DESC, account_id ASC
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

});

router.post('/api/table-data/publicity-info', async (request, env, context) => {

  try {
    const { data } = await request.json();
    console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
    const sql = `
    INSERT INTO publicity_info (run_date, invited_id, start_date, end_date)
         VALUES (?,?,?,?)
      ON CONFLICT(run_date, invited_id) DO UPDATE SET
        start_date=excluded.start_date,
        end_date=excluded.end_date
    `
    console.log('sql: ', sql);
    for (const item of data) {
      await env.DB.prepare(sql)
        .bind(item.run_date, item.invited_id, item.start_date, item.end_date)
        .run();
    }

  } catch (error) {
    console.error("Error inserting data:", error);
    return json({ success: false, error: error.message });
  }

  return json({ success: true, name: 'ok' });
});

export default router;

// export default {
//   fetch(request, env) {
//     const url = new URL(request.url);

//     if (url.pathname.startsWith("/api/")) {
//       return Response.json({
//         name: "Cloudflare",
//       });
//     }

//     return new Response(null, { status: 404 });
//   },
// }
