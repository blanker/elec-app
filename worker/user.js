import { json } from 'itty-router' // ~1kB

export const newUser = async (request, env, context) => {

    try {
        const { data } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        /* {
        "account": "楚雄移动展厅",
        "name": "f",
        }*/
        const sql = `
    INSERT INTO user ( phone, name, password, salt)
         VALUES (?, ?, ?, ?)
    `
        console.log('sql: ', sql);
        const { phone, name, password } = data;

        const old = await getUser(phone, env);
        // console.log('old: ', old);
        if (old) {
            console.log('old: ', old);
            return json({ success: false, error: '该手机号已注册' });
        }
        // 根据手机号生成盐
        const salt = await generateSalt(phone);
        // 使用盐对密码进行哈希
        const secured_password = await hashPassword(password, salt);
        console.log('password: ', secured_password);
        console.log('salt: ', salt);

        await env.DB.prepare(sql)
            .bind(phone, name, secured_password, salt)
            .run();

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }

    return json({ success: true, name: 'ok' });
};

export const login = async (request, env, context) => {
    try {
        const { data } = await request.json();
        console.log('【service_worker.js】->【content】【ajax-tools-iframe-show】Return message:', data);
        // 获取用户信息
        const { phone, password } = data;
        const user = await getUser(phone, env);
        console.log('user: ', user);
        if (!user) {
            return json({ success: false, error: '用户或密码错误' });
        }
        // 验证密码
        const { password: hashed_password, salt } = user;
        const secured_password = await hashPassword(password, salt);
        if (hashed_password !== secured_password) {
            return json({ success: false, error: '用户或密码错误' });
        }

        // 生成token
        const token = await generateToken(user.id, env);
        console.log('token: ', token);
        const { id, name, tenant_id, tenant, tenants } = user;
        // 返回用户信息和token
        return json({
            success: true, data: {
                id,
                name,
                phone,
                token,
                tenant_id,
                tenant,
                tenants,
            }
        });

    } catch (error) {
        console.error("Error inserting data:", error);
        return json({ success: false, error: error.message });
    }
}

export const getUser = async (phone, env) => {

    try {

        const sql = `
    SELECT * FROM user WHERE phone = ? 
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(phone)
            .run();

        if (result.results.length == 0) {
            return null;
        }
        const user = result.results[0];
        const tenant = await getTenant(user.tenant_id, env);
        const tenants = await getUserTenants(user.phone, env);
        user.tenant = tenant;
        user.tenants = tenants;
        return user;
    } catch (error) {
        console.error("Error inserting data:", error);
        return null;
    }

};

export const getUserTenants = async (phone, env) => {

    try {

        const sql = `
    SELECT u.*,t.name AS tenant_name 
      FROM user_tenant u, 
           tenant t
     WHERE u.tenant_id = t.id
       AND u.phone = ?
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(phone)
            .run();

        if (result.results.length == 0) {
            return null;
        }
        const tenants = result.results;
        return tenants;
    } catch (error) {
        console.error("Error inserting data:", error);
        return null;
    }

};

export const switchTenant = async (request, env) => {
    const { tenant: tenantId } = await request.json();
    try {

        const sql = `
    UPDATE user SET tenant_id = ? WHERE id = ? 
    `
        console.log('sql: ', sql);
        await env.DB.prepare(sql)
            .bind(tenantId, request.user.id)
            .run();

        const user = await getUserById(request.user.id, env);
        const { id, name, tenant_id, tenant, tenants, phone } = user;
        // 返回用户信息和token
        return json({
            success: true, 
            data: {
                id,
                name,
                phone,
                tenant_id,
                tenant,
                tenants,
            }
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return null;
    }
}

export const getUserById = async (id, env) => {

    try {

        const sql = `
    SELECT * FROM user WHERE id = ? 
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(id)
            .run();

        if (result.results.length == 0) {
            return null;
        }
        const user = result.results[0];
        const tenant = await getTenant(user.tenant_id, env);
        const tenants = await getUserTenants(user.phone, env);
        user.tenant = tenant;
        user.tenants = tenants;
        return user;
    } catch (error) {
        console.error("Error inserting data:", error);
        return null;
    }

};

export const getTenant = async (tenant_id, env) => {

    try {

        const sql = `
    SELECT * FROM tenant WHERE id = ? 
    `
        console.log('sql: ', sql);
        const result = await env.DB.prepare(sql)
            .bind(tenant_id)
            .run();

        if (result.results.length == 0) {
            return null;
        }

        return result.results[0];
    } catch (error) {
        console.error("Error get tenant data:", error);
        return null;
    }

};

// 生成盐值
async function generateSalt(phone) {
    // 使用手机号作为种子，生成固定长度的盐值
    const encoder = new TextEncoder();
    const data = encoder.encode(phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // 取前16个字符作为盐值
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// 使用盐对密码进行哈希
async function hashPassword(password, salt) {
    if (!password) return null;

    // 将密码和盐值组合
    const combined = password + salt;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);

    // 使用 SHA-256 进行哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // 转换为16进制字符串
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 生成 token
async function generateToken(userId, env) {
    // 创建 token 的有效载荷
    const payload = {
        userId,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
        iat: Date.now()
    };

    // 将 payload 转换为字符串
    const payloadStr = JSON.stringify(payload);

    // 使用用户ID和时间戳生成签名
    const encoder = new TextEncoder();
    const data = encoder.encode(payloadStr + env.JWT_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const signature = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // 组合 token（Base64编码的payload + '.' + 签名）
    const token = btoa(payloadStr) + '.' + signature;
    return token;
}

// 验证 token
async function verifyToken(token, env) {
    try {
        // 分割 token
        const [payloadBase64, signature] = token.split('.');

        // 解码 payload
        const payloadStr = atob(payloadBase64);
        const payload = JSON.parse(payloadStr);

        // 检查是否过期
        if (payload.exp < Date.now()) {
            return null;
        }

        // 验证签名
        const encoder = new TextEncoder();
        const data = encoder.encode(payloadStr + env.JWT_SECRET);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const calculatedSignature = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (signature !== calculatedSignature) {
            return null;
        }

        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// 添加中间件函数用于验证请求中的token
export async function authMiddleware(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, error: '未授权访问' };
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token, env);

    if (!payload) {
        return { success: false, error: 'token无效或已过期' };
    }

    const user = await getUserById(payload.userId, env); // 验证token后，获取用户信息，保存在上下文中，供后续使用
    console.log('authMiddleware userId: ', payload.userId, user);

    return {
        success: true,
        userId: payload.userId,
        user
    };
}

/*
// 登录成功后保存token
localStorage.setItem('token', response.data.token);

// 在请求头中使用token
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
};

// 发送请求时携带token
fetch('/api/some-endpoint', {
    headers: headers
});
*/