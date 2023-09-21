import { Button } from "@mui/material";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import TokenUtilService from "../../utils/token-util";

function AdminCenter() {
	const navigate = useNavigate();

	return (
		<div
			style={{
				border: "solid",
				borderRadius: 15,
				borderColor: "lightgray",
				margin: "5%",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<h2 style={{ marginTop: "3%", textAlign: "center" }}>
				Simulation Entities{" "}
			</h2>
			<div
				style={{
					marginTop: " 1%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Button
					name="categoryList"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/category")}
				>
					Category
				</Button>
				<Button
					name="talentList"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/talent")}
				>
					Talent
				</Button>
				<Button
					name="taskList"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/task")}
				>
					Task
				</Button>
				<Button
					name="workerList"
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/worker")}
				>
					Worker
				</Button>
			</div>

			<br />

			<div
				style={{
					marginBottom: "1%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Button
					name="backlogList"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/backlog")}
				>
					Backlog
				</Button>
				<Button
					name="projectList"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/project")}
				>
					Project
				</Button>
				{/* <Button
					name="userList"
					size={"large"}
					variant="contained"
					onClick={() => navigate("/center/user")}
				>
					User
				</Button> */}
			</div>
		</div>
	);
}

export default AdminCenter;
