import {
    createHashRouter,
    RouterProvider,
} from "react-router";

import Login from "./login";
import Home from "./home";

const router = createHashRouter([
    { index: true, Component: Home },
    { path: "login", Component: Login },
]);

export default function RootRouter({ children }) {

    return (
        <RouterProvider router={router}>
            {children}
        </RouterProvider>
    );
}