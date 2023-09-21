import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const PlannerAdmin = React.lazy(() => import("balaz/BoardAdmin"));
const SimulationAdmin = React.lazy(() => import("marhevsky/AdminCenter"));

export default function AdminCenter() {
	const navigate = useNavigate();

	return (
		<div className="container mt-3">
			<div
				style={{
					border: "solid",
					borderRadius: 15,
					borderColor: "lightgray",
					margin: "5%",
					padding: "5%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<h1 style={{ textAlign: "center" }}>Admin Center</h1>
				<div
					style={{
						display: "block",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							marginRight: "1%",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "2%",
						}}
					>
						<Button
							name="projectList"
							size={"large"}
							variant="contained"
							onClick={() => navigate("/center/user")}
						>
							Users
						</Button>
					</div>
					<SimulationAdmin />
					<PlannerAdmin />
				</div>
			</div>
		</div>
	);
}
