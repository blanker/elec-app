import {
    createHashRouter,
} from "react-router";
import DashboardLayout from '@/layout/DashboardLayout'
import Home from '@/app/dashboard/page'
import DeclarationPage from '@/app/declaration/page'
import ResponsePage from '@/app/response/page'
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
            // { path: "contact", Component: Contact },
        ],
    },

]);

export default routes;