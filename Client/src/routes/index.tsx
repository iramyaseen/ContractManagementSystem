import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../auth/login";
import Signup from "../auth/signup";
import Dashbaord from "../dashboard";


export const publicRoutes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "*",
        element: <Navigate to='/login' />
    }, 
    
]);


export const privateRoutes = createBrowserRouter([
    {
        path: "/dashboard",
        element: <Dashbaord />
    },
    {
        path: "*",
        element: <Navigate to='/dashboard' />
    }, 
]);