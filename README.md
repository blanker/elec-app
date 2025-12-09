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

```bash
curl -X POST \
      -H "Content-Type: application/json" \
            -d '{"data": {"id": "0504001900061129", "isEa": "N", "loads": {"H00D00": 0, "H00D15": 0, "H00D30": 0, "H00D45": 0, "H01D00": 0, "H01D15": 0, "H01D30": 0, "H01D45": 0, "H02D00": 0, "H02D15": 0, "H02D30": 0, "H02D45": 0, "H03D00": 0, "H03D15": 0, "H03D30": 0, "H03D45": 0, "H04D00": 0, "H04D15": 0, "H04D30": 0, "H04D45": 0, "H05D00": 0, "H05D15": 0, "H05D30": 0, "H05D45": 0, "H06D00": 0, "H06D15": 0, "H06D30": 0, "H06D45": 0, "H07D00": 0, "H07D15": 0, "H07D30": 0, "H07D45": 0, "H08D00": 0, "H08D15": 0, "H08D30": 0, "H08D45": 0, "H09D00": 0, "H09D15": 0, "H09D30": 0, "H09D45": 0, "H10D00": 0, "H10D15": 0, "H10D30": 0, "H10D45": 0, "H11D00": 0, "H11D15": 0, "H11D30": 0, "H11D45": 0, "H12D00": 39.2, "H12D15": 44.8, "H12D30": 43.2, "H12D45": 44, "H13D00": 22.4, "H13D15": 5.6, "H13D30": 0, "H13D45": 0, "H14D00": 0, "H14D15": 36, "H14D30": 60.8, "H14D45": 86.4, "H15D00": 96.8, "H15D15": 96.8, "H15D30": 96, "H15D45": 94.4, "H16D00": 0, "H16D15": 0, "H16D30": 0, "H16D45": 0, "H17D00": 0, "H17D15": 0, "H17D30": 0, "H17D45": 0, "H18D00": 0, "H18D15": 0, "H18D30": 0, "H18D45": 0, "H19D00": 0, "H19D15": 0, "H19D30": 0, "H19D45": 0, "H20D00": 0, "H20D15": 0, "H20D30": 0, "H20D45": 0, "H21D00": 0, "H21D15": 0, "H21D30": 0, "H21D45": 0, "H22D00": 0, "H22D15": 0, "H22D30": 0, "H22D45": 0, "H23D00": 0, "H23D15": 0, "H23D30": 0, "H23D45": 0, "IS24POINT": "N"}, "score": "0", "crtTime": 1764569281000, "resType": "工业负荷", "respTime": "00:00:00~23:59:59", "loads_use": {"H00D00": 0, "H00D15": 0, "H00D30": 0, "H00D45": 0, "H01D00": 0, "H01D15": 0, "H01D30": 0, "H01D45": 0, "H02D00": 0, "H02D15": 0, "H02D30": 0, "H02D45": 0, "H03D00": 0, "H03D15": 0, "H03D30": 0, "H03D45": 0, "H04D00": 0, "H04D15": 0, "H04D30": 0, "H04D45": 0, "H05D00": 0, "H05D15": 0, "H05D30": 0, "H05D45": 0, "H06D00": 0, "H06D15": 0, "H06D30": 0, "H06D45": 0, "H07D00": 0, "H07D15": 0, "H07D30": 0, "H07D45": 0, "H08D00": 0, "H08D15": 0, "H08D30": 0, "H08D45": 0, "H09D00": 0, "H09D15": 0, "H09D30": 0, "H09D45": 0, "H10D00": 0, "H10D15": 0, "H10D30": 0, "H10D45": 0, "H11D00": 0, "H11D15": 0, "H11D30": 0, "H11D45": 0, "H12D00": 39.2, "H12D15": 44.8, "H12D30": 43.2, "H12D45": 44, "H13D00": 22.4, "H13D15": 5.6, "H13D30": 0, "H13D45": 0, "H14D00": 0, "H14D15": 36, "H14D30": 60.8, "H14D45": 86.4, "H15D00": 96.8, "H15D15": 96.8, "H15D30": 96, "H15D45": 94.4, "H16D00": 0, "H16D15": 0, "H16D30": 0, "H16D45": 0, "H17D00": 0, "H17D15": 0, "H17D30": 0, "H17D45": 0, "H18D00": 0, "H18D15": 0, "H18D30": 0, "H18D45": 0, "H19D00": 0, "H19D15": 0, "H19D30": 0, "H19D45": 0, "H20D00": 0, "H20D15": 0, "H20D30": 0, "H20D45": 0, "H21D00": 0, "H21D15": 0, "H21D30": 0, "H21D45": 0, "H22D00": 0, "H22D15": 0, "H22D30": 0, "H22D45": 0, "H23D00": 0, "H23D15": 0, "H23D30": 0, "H23D45": 0}, "userState": "RUN", "voltLevel": "交流10kV", "voltagekV": 0, "capAbility": "250", "entityType": "需求侧响应用户", "locateArea": "050400", "maxRespLoad": 250, "minRespLoad": 0, "maxValleyLoad": 250, "minValleyLoad": 0, "maxResponceDur": "24", "maxResponcePow": "250", "minResponceDur": "0", "minResponcePow": "0", "electricityType": "非工业"}, "extra": {"run_date": "2025-12-03"}, "tenant": "91530112MA6NUXXJ8N", "timestamp": 1764569832820, "__headers__": {"host": "rust-xwjx:8080", "accept": "*/*", "cf-ray": "9a7075d0730c7763-AMS", "origin": "null", "cdn-loop": "cloudflare; loops=1; subreqs=1", "priority": "u=1, i", "cf-ew-via": "15", "cf-worker": "blanker.cc", "cf-visitor": "{\"scheme\":\"https\"}", "connection": "close", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "2786", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "none", "accept-encoding": "gzip, br", "accept-language": "zh-CN,zh;q=0.9", "x-forwarded-for": "112.117.205.126", "cf-connecting-ip": "112.117.205.126", "x-forwarded-proto": "https", "sec-fetch-storage-access": "active"}, "tenant_name": null, "__full_url__": "https://rust-xwjx:8080/api/v2/private/crawl/proxy/table-data/daily-demand-market/"}' \
      -v https://admin.xuanweijiuxie.cn/api/v2/private/crawl/proxy/table-data/daily-demand-market/
```

### 显示线上日志

```bash
wrangler tail
```

### 前端调试

#### 连接的后台，通过 src/config/env.js 配置

```bash
npm run dev
```
