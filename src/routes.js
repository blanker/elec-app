import {
    createBrowserRouter,
} from "react-router";
import DashboardLayout from '@/layout/DashboardLayout'
import Home from '@/app/dashboard/page'
import DeclarationPage from '@/app/declaration/page'
import useAccountStore from "@/store/useAccountStore";

const routes = createBrowserRouter([
    {
        // no path on this parent route, just the component
        Component: DashboardLayout,
        loader: () => {
            useAccountStore.getState().fetchAccounts();
            return {};
        },
        children: [
            { index: true, Component: Home },
            { path: "declaration", Component: DeclarationPage },
            // { path: "contact", Component: Contact },
        ],
    },

]);

export default routes;