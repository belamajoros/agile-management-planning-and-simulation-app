import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
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
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button
						name="planner"
						style={{ marginRight: " 1%" }}
						size={"large"}
						variant="contained"
						fullWidth={true}
						onClick={() => navigate("/planner")}
						data-cy="planner-button"
					>
						Agile planner
					</Button>
					<Button
						name="simulation"
						style={{ marginRight: " 1%" }}
						size={"large"}
						variant="contained"
						fullWidth={true}
						onClick={() => navigate("/simulation")}
						data-cy="simulator-button"
					>
						Agile simulator
					</Button>
				</div>
			</div>
		</div>
	);
}
