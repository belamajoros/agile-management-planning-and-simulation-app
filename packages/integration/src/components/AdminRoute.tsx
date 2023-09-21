import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import UserService from "balaz/UserService";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = (props: { children: React.ReactNode }): JSX.Element => {
	const { children } = props;
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkIsAdmin = async () => {
			if (localStorage.getItem("user")) {
				const userData = localStorage.getItem("user");

				if (userData) {
					try {
						const parsedUser = JSON.parse(userData);
						const response = await UserService.getUser(parsedUser.user._id);
						setIsAdmin(response.data.roles.includes("admin"));
					} catch (error) {
						console.error("Error fetching user data:", error);
					}
				}
			}
			setLoading(false);
		};

		checkIsAdmin();
	}, []);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return isAdmin ? <>{children}</> : <Navigate replace={true} to="/home" />;
};

export default AdminRoute;
