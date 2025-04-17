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
