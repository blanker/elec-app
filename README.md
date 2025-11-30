### 升级 wrangler

```bash
npm install wrangler@latest
```

### 新建用户

```bash
curl -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization:Bearer eyJ1c2VySWQiOjEsImV4cCI6MTc0NTUwNTIwNDc5NiwiaWF0IjoxNzQ1NDE4ODA0Nzk2fQ==.0cd5611b025ea4454aba8990cbcde6d88dbb912156aca221e3477858f67f1f3b" \
      -d '{"data" : {"phone": "18468103960", "name": "邓毛毛", "password": "103960"}}' \
      -v http://elec.blanker.cc/api/private/table-data/new-user
```

### 模拟请求

```bash
curl -X POST \
      -H "Content-Type: application/json" \
            -d '{"data" : {"rows": [{  "begintime": 1737604580000,   "buType": "被代理用户",  "capAbility": "2850",  "creditCode": "91530381MA7H78C600",  "gainSharing": 20,  "id": "0502053202933855",  "isEa": "N",  "isQa": "Y",  "locateArea": "050200",  "marketState": "运行",  "maxRespLoad": 1250,  "maxResponcePow": "1250",  "maxValleyLoad": 800,  "minRespLoad": 0,  "minResponcePow": "0",  "minValleyLoad": 0,  "name": "宣威市昌能新能源汽车服务有限公司",  "resType": "电动汽车负荷",  "voltLevel": "交流10kV",  "voltagekV": 0}]}, "tenant": "91440101MA5D693M4Q", "tenant_name": "广东万嘉售电有限公司"}' \
      -v http://elec.blanker.cc/api/table-data/account-agent
```

### 显示线上日志

```bash
wrangler tail
```
