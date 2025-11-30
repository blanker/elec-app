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

# 4 运行对比脚本
./compare-d1.sh

