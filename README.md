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
