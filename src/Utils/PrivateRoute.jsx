import { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import { DataWebContext } from "../context/Context";
import Loader from "./Loaders";

function PrivateRoute({ element, redirect, route }) {
    const context = useContext(DataWebContext)
    if (!context.loading) {
        if (context.isLogin()) {
            if (context.verific(route)) {
                return element
            }
            else{
                return <Navigate to={'/dashboard/unallow'} />
            }
        }
        return <Navigate to={'/authenticate'} />
    }
    else{
        return <Loader/>
    }
}

export default PrivateRoute;