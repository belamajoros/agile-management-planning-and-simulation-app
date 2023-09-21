import React from "react";
import { Navigate } from "react-router-dom";
import TokenUtilService from "../../utils/token-util";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
	const { children } = props;
	const isLoggedIn: boolean =
		localStorage.getItem("jwt_token") !== null &&
		TokenUtilService.isTokenValid();
	if (localStorage.getItem("jwt_token") !== null) {
		if (!TokenUtilService.isTokenValid()) {
			alert("Session expired! Please Login again.");
			TokenUtilService.invalidateToken();
		}
	}

	return isLoggedIn ? <>{children}</> : <Navigate replace={true} to="/login" />;
};
export default PrivateRoute;
