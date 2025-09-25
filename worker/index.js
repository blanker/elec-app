import { AutoRouter, cors, json, error } from 'itty-router' // ~1kB
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
import { saveAccounts, saveAccountAgent, getAccounts } from './account.js';
import { saveCustomer } from './customer.js';
import { saveSettlements, saveSettlementDetail, countByMonth, fetchByMonth, fetchDetailByMonth } from './settlement.js';
import { newUser, login, authMiddleware, switchTenant } from './user.js';
import { getTenant } from './tenant.js';
import {saveInfoPublictiList, saveInfoPublictiListList} from './info-publicity.js'

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
  allowHeaders: ['content-type', 'x-bar', 'authorization'],
  // exposeHeaders: 'x-foo, x-bar',
  // exposeHeaders: ['x-foo', 'x-bar'],
  maxAge: 84600,
})
const router = AutoRouter({
  before: [preflight],  // add preflight upstream
  finally: [corsify],   // and corsify downstream
})

// MIDDLEWARE: withAuthenticatedUser - embeds user in Request or returns a 401
const withAuthenticatedUser = async (request, env) => {
  // 不拦截 /api/private/login 
  if (request.url.includes('/api/private/login')) {
    return;
  }

  // return;

  const user = await authMiddleware(request, env);

  // by returning early here, we cut off all future handlers
  if (!user.success) return error(401, 'Invalid user.')

  // otherwise, we embed the user for future use
  request.userId = user.userId;
  request.user = user.user;
}

router
  .all('/api/private/*', withAuthenticatedUser)
  .get('/api/hello/:name', ({ name }) => `Hello, ${name}!`)
  .get('/api/json', () => json({ name: 'json' }))
  .get('/api', () => json({ name: 'gogo' }))
  .get('/api/promises', () => Promise.resolve('foo'))

router.post('/api/foo', (request, env, context) => new Response(JSON.stringify({ foo: 'bar' }), {
  headers: { 'Content-Type': 'application/json' },
}));

router.post('/api/table-device/', saveDevices);

router.post('/api/table-data/account', saveAccounts);
router.post('/api/table-data/account-agent', saveAccountAgent);
router.post('/api/private/accounts', getAccounts);

router.post('/api/table-data/daily-demand-market/', saveDeclaration);
router.post('/api/private/rundates', statDeclarationRundates);
router.post('/api/private/rundate-data', getDeclarationsByRundate);

router.post('/api/table-data/publicity-info', savePublicityInfoList);
router.post('/api/private/publicity-infos', getPublicityInfoList);
router.post('/api/table-data/bu-response-cap', saveResponses);
router.post('/api/private/responses', statResponses);
router.post('/api/private/stat-response-group-by-rundate', statResponseGroupByRundate);
router.post('/api/private/get-responses-by-rundate', getResponsesByRundate);

router.post('/api/table-data/info-publcity', saveInfoPublictiList);
router.post('/api/table-data/info-publcity-list', saveInfoPublictiListList);

router.post('/api/table-data/customer', saveCustomer);

router.post('/api/table-data/settlement', saveSettlements);
router.post('/api/table-data/settlement-detail', saveSettlementDetail);
router.post('/api/private/settlement-count-by-month', countByMonth);
router.post('/api/private/settlements-by-month', fetchByMonth);
router.post('/api/private/settlement-detail-by-month', fetchDetailByMonth);

router.post('/api/private/table-data/new-user', newUser);
router.post('/api/private/login', login);
router.post('/api/private/switchTenant', switchTenant);

router.post('/api/private/tenants', getTenant);

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
