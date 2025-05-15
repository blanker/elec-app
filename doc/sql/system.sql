CREATE TABLE user_tenant (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    phone text not null,
    tenant_id text not null
);

CREATE UNIQUE INDEX uk_ut_pt ON user_tenant (phone, tenant_id);

-- 91440101MA5D693M4Q	广东万嘉售电有限公司	<null>	<null>	2025-04-26 08:01:49	2050-12-31
-- 91530112MA6NUXXJ8N	云南耀昇电力有限公司	<null>	<null>	2025-05-13 12:31:59	2050-12-31
insert into user_tenant(phone, tenant_id) values('13987193193', '91440101MA5D693M4Q');
insert into user_tenant(phone, tenant_id) values('13987193193', '91530112MA6NUXXJ8N');

insert into user_tenant(phone, tenant_id) values('18468103960', '91440101MA5D693M4Q');
insert into user_tenant(phone, tenant_id) values('13887487478', '91440101MA5D693M4Q');

insert into user_tenant(phone, tenant_id) values('13629482076', '91530112MA6NUXXJ8N');
