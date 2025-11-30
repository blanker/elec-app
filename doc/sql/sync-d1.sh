#!/bin/bash
BASE_DIR=/opt/sqlite

# 把变量“导出”为环境变量，使后续启动的子进程（如 wrangler ）都能读取到
export CLOUDFLARE_API_TOKEN="9BI42ueJ2yx4MqrV4xbAWHVQQkbRFk_LOhI486vY"
export CLOUDFLARE_ACCOUNT_ID="b66c3a38be3615124f6aad3a925c3801"

# 1 先从d1导出sql
cd $BASE_DIR
wrangler d1 export data --remote --table account --output ./account.sql
wrangler d1 export data --remote --table bu_response_cap --output ./bu_response_cap.sql
wrangler d1 export data --remote --table customer --output ./customer.sql
wrangler d1 export data --remote --table info_publicity --output ./info_publicity.sql
wrangler d1 export data --remote --table publicity_info --output ./publicity_info.sql
wrangler d1 export data --remote --table settlement --output ./settlement.sql
wrangler d1 export data --remote --table settlement_detail --output ./settlement_detail.sql
wrangler d1 export data --remote --table tenant --output ./tenant.sql
wrangler d1 export data --remote --table user --output ./user.sql
wrangler d1 export data --remote --table user_tenant --output ./user_tenant.sql

wrangler d1 export data --remote --table info_publicity_list --output ./info_publicity_list.sql
#wrangler d1 export data --remote --table daily_demand_market_new --output ./daily_demand_market_new.sql

#wrangler d1 export data --remote --table daily_demand_market --output ./daily_demand_market.sql

# 2 再把sql转换成sqlite数据库
# 转换之前先清除所有.sqlite数据库文件
rm -f *.sqlite

/usr/local/bin/sqlite3 account.sqlite < account.sql
/usr/local/bin/sqlite3 bu_response_cap.sqlite < bu_response_cap.sql
/usr/local/bin/sqlite3 customer.sqlite < customer.sql
/usr/local/bin/sqlite3 info_publicity.sqlite < info_publicity.sql
/usr/local/bin/sqlite3 publicity_info.sqlite < publicity_info.sql
/usr/local/bin/sqlite3 settlement.sqlite < settlement.sql
/usr/local/bin/sqlite3 settlement_detail.sqlite < settlement_detail.sql
/usr/local/bin/sqlite3 tenant.sqlite < tenant.sql
/usr/local/bin/sqlite3 user.sqlite < user.sql
/usr/local/bin/sqlite3 user_tenant.sqlite < user_tenant.sql

# 问题： info_publicity_list 数据中出现错误的对应关系 38条/41条(1129)，待验证
/usr/local/bin/sqlite3 info_publicity_list.sqlite < info_publicity_list.sql
#/usr/local/bin/sqlite3 daily_demand_market_new.sqlite < daily_demand_market_new.sql

#/usr/local/bin/sqlite3 daily_demand_market.sqlite < daily_demand_market.sql
    
# 3 运行转换脚本:pgloader.load
docker run --rm --network my-network \
    -v /opt/sqlite:/opt/sqlite \
    crpi-7y9fo7jfr9xmipu3.cn-hangzhou.personal.cr.aliyuncs.com/blankerer/pgloader:latest \
    pgloader /opt/sqlite/pgloader.load

# 4 先分段查询d1数据库的数据量
wrangler d1 execute data --remote --json --command "
SELECT 'account' AS name, COUNT(*) AS cnt FROM account
UNION ALL
SELECT 'bu_response_cap' AS name, COUNT(*) AS cnt FROM bu_response_cap
UNION ALL
SELECT 'customer' AS name, COUNT(*) AS cnt FROM customer
UNION ALL
SELECT 'info_publicity' AS name, COUNT(*) AS cnt FROM info_publicity
UNION ALL
SELECT 'publicity_info' AS name, COUNT(*) AS cnt FROM publicity_info;
" | jq -r '.[0].results[] | "\(.name),\(.cnt)"' > ./d1-count1.csv

### 结果类似
###
#
# ⛅️ wrangler 4.51.0
#───────────────────
#Resource location: remote
#
#🌀 Executing on remote database data (70b9dd59-0fe2-4ab7-9dd8-cb272fe54352):
#🌀 To execute on your local development database, remove the --remote flag from your wrangler command.
#🚣 Executed 1 command in 3.33ms
#┌─────────────────┬──────┐
#│ name            │ cnt  │
#├─────────────────┼──────┤
#│ account         │ 1086 │
#├─────────────────┼──────┤
#│ bu_response_cap │ 1048 │
#├─────────────────┼──────┤
#│ customer        │ 2    │
#├─────────────────┼──────┤
#│ info_publicity  │ 152  │
#├─────────────────┼──────┤
#│ publicity_info  │ 93   │
#└─────────────────┴──────┘
#

wrangler d1 execute data --remote --json --command "
SELECT 'settlement' AS name, COUNT(*) AS cnt FROM settlement
UNION ALL
SELECT 'settlement_detail' AS name, COUNT(*) AS cnt FROM settlement_detail
UNION ALL
SELECT 'tenant' AS name, COUNT(*) AS cnt FROM tenant
UNION ALL
SELECT 'user' AS name, COUNT(*) AS cnt FROM \"user\"
UNION ALL
SELECT 'user_tenant' AS name, COUNT(*) AS cnt FROM user_tenant; 
" | jq -r '.[0].results[] | "\(.name),\(.cnt)"' > ./d1-count2.csv

wrangler d1 execute data --remote --json --command "
SELECT 'info_publicity_list' AS name, COUNT(*) AS cnt FROM info_publicity_list
UNION ALL
SELECT 'daily_demand_market_new' AS name, COUNT(*) AS cnt FROM daily_demand_market_new
UNION ALL
SELECT 'daily_demand_market' AS name, COUNT(*) AS cnt FROM daily_demand_market
; 
" | jq -r '.[0].results[] | "\(.name),\(.cnt)"' > ./d1-count3.csv


# 5 查询pg中的数据量
docker exec -e PGPASSWORD="mysecretpassword-Of-pg123" postgres psql -U postgres -d xwjx -A -t -F , -c "
SELECT 'account' AS name, COUNT(*) AS cnt FROM elec_app.account
UNION ALL
SELECT 'bu_response_cap', COUNT(*) FROM elec_app.bu_response_cap
UNION ALL
SELECT 'customer', COUNT(*) FROM elec_app.customer
UNION ALL
SELECT 'info_publicity', COUNT(*) FROM elec_app.info_publicity
UNION ALL
SELECT 'publicity_info', COUNT(*) FROM elec_app.publicity_info;
" > ./pg-data-count1.log

###结果类似
#       name       | cnt
#-----------------+------
# account         | 1086
# bu_response_cap | 1048
# customer        |    2
# info_publicity  |  152
# publicity_info  |   93
# (5 rows)

# 第二段查询pg中的数据量
docker exec -e PGPASSWORD="mysecretpassword-Of-pg123" postgres psql -U postgres -d xwjx -A -t -F , -c "
SELECT 'settlement', COUNT(*) FROM elec_app.settlement
UNION ALL
SELECT 'settlement_detail', COUNT(*) FROM elec_app.settlement_detail
UNION ALL
SELECT 'tenant', COUNT(*) FROM elec_app.tenant
UNION ALL
SELECT 'user', COUNT(*) FROM elec_app."user"
UNION ALL
SELECT 'user_tenant', COUNT(*) FROM elec_app.user_tenant;
" > ./pg-data-count2.log

# 第三段
docker exec -e PGPASSWORD="mysecretpassword-Of-pg123" postgres psql -U postgres -d xwjx -A -t -F , -c "
SELECT 'info_publicity_list', COUNT(*) FROM elec_app.info_publicity_list
UNION ALL
SELECT 'daily_demand_market_new', COUNT(*) FROM elec_app.daily_demand_market_new
UNION ALL
SELECT 'daily_demand_market', COUNT(*) FROM elec_app.daily_demand_market
" > ./pg-data-count3.log

# 7 汇总并对比 D1 与 PG 的数据量（统一 CSV 流程）
# 7.1 合并 D1 CSV（wrangler --json | jq 已输出为 name,cnt）
cat ./d1-count1.csv ./d1-count2.csv ./d1-count3.csv > ./d1-count.csv

# 7.2 合并 PG 侧 CSV（psql 已按 -A -t -F , 输出）
cat ./pg-data-count1.log ./pg-data-count2.log ./pg-data-count3.log > ./pg-count.csv

# 7.3 对比并输出结果到 CSV 与人类可读文本
{
  echo "name,d1,pg,diff,match"
  declare -A D1
  while IFS=',' read -r name cnt; do
    [ -n "$name" ] && D1["$name"]="$cnt"
  done < ./d1-count.csv

  declare -A SEEN
  while IFS=',' read -r name cnt_pg; do
    SEEN["$name"]=1
    d1cnt="${D1[$name]}"
    if [ -z "$d1cnt" ]; then
      echo "$name,$d1cnt,$cnt_pg,,missing_in_d1"
    else
      if [ "$cnt_pg" = "$d1cnt" ]; then
        echo "$name,$d1cnt,$cnt_pg,0,ok"
      else
        diff=$((cnt_pg - d1cnt))
        echo "$name,$d1cnt,$cnt_pg,$diff,mismatch"
      fi
    fi
  done < ./pg-count.csv

  # 找出仅在 D1 存在而 PG 缺失的表
  while IFS=',' read -r name cnt_d1; do
    if [ -z "${SEEN["$name"]}" ]; then
      echo "$name,$cnt_d1,,,missing_in_pg"
    fi
  done < ./d1-count.csv
} > ./compare-counts.csv

echo "对比结果已生成: ./compare-counts.csv"
cat ./compare-counts.csv

