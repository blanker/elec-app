import {
    createHashRouter,
} from "react-router";
import DashboardLayout from '@/layout/DashboardLayout'
import Home from '@/app/dashboard/page'
import DeclarationPage from '@/app/declaration/page'
import ResponsePage from '@/app/response/page'
import AccountPage from '@/app/account/page'
import SettlementPage from '@/app/settlement/page'
import SettlementDetailPage from '@/app/settlement-detail/page'

import TenantPage from '@/app/tenant/page'

import LoginPage from '@/app/login/page'

import useAccountStore from "@/store/useAccountStore";
import useResponseStore from "@/store/useResponseStore";

const routes = createHashRouter([
    {
        // no path on this parent route, just the component
        Component: DashboardLayout,
        loader: () => {
            useAccountStore.getState().fetchAccounts();
            useResponseStore.getState().fetchPublicityInfos();
            return {};
        },
        children: [
            { index: true, Component: Home },
            { path: "declaration", Component: DeclarationPage },
            { path: "response", Component: ResponsePage },
            { path: "accounts", Component: AccountPage },
            { path: "settlement", Component: SettlementPage },
            { path: "settlement-detail", Component: SettlementDetailPage },
            { path: "tenant", Component: TenantPage },
            // { path: "contact", Component: Contact },
        ],
    },
    {
        path: "login",
        Component: LoginPage,
    }

]);

export default routes;