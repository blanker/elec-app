import { AutoRouter, cors, json } from 'itty-router' // ~1kB
import {
  saveResponses,
  savePublicityInfoList,
  getPublicityInfoList,
  statResponses,
  statResponseGroupByRundate,
  getResponsesByRundate,
} from './publicity-info.js';
import { saveDevices } from './device.js';
import { saveDeclaration, statDeclarationRundates, getDeclarationsByRundate } from './declaration.js';
import { saveAccounts, getAccounts } from './account.js';
import { saveSettlements } from './settlement.js';

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

router.post('/api/table-device/', saveDevices);

router.post('/api/table-data/account', saveAccounts);
router.post('/api/accounts', getAccounts);

router.post('/api/table-data/daily-demand-market/', saveDeclaration);
router.post('/api/rundates', statDeclarationRundates);
router.post('/api/rundate-data', getDeclarationsByRundate);

router.post('/api/table-data/publicity-info', savePublicityInfoList);
router.post('/api/publicity-infos', getPublicityInfoList);
router.post('/api/table-data/bu-response-cap', saveResponses);
router.post('/api/responses', statResponses);
router.post('/api/stat-response-group-by-rundate', statResponseGroupByRundate);
router.post('/api/get-responses-by-rundate', getResponsesByRundate);

router.post('/api/table-data/settlement', saveSettlements);

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
