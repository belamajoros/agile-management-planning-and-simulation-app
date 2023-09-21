import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import TokenUtilService from "../utils/token-util";

function Home() {
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
			<div
				style={{
					marginTop: " 1%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Button
					name="createCategory"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/category")}
					data-cy="category-button"
				>
					Create new category
				</Button>
				<Button
					name="createTalent"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/talent")}
					data-cy="talent-button"
				>
					Create new talent
				</Button>
				<Button
					name="createWorker"
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/worker")}
					data-cy="worker-button"
				>
					Create new worker
				</Button>
			</div>

			<br />

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Button
					name="createTask"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/task")}
					data-cy="task-button"
				>
					Create new task
				</Button>
				<Button
					name="createBacklog"
					style={{ marginRight: " 1%" }}
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/backlog")}
					data-cy="backlog-button"
				>
					Create new backlog
				</Button>
				<Button
					name="createProject"
					size={"large"}
					variant="contained"
					onClick={() => navigate("/simulation/project")}
					data-cy="project-button"
				>
					Create new project
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
					name="createTask"
					size={"large"}
					style={{ marginRight: " 1%" }}
					variant="contained"
					onClick={() => navigate("/simulation/simulate")}
					data-cy="simulate-button"
				>
					Simulate
				</Button>
				{TokenUtilService.isAdmin() ? (
					<Button
						name="createBacklog"
						size={"large"}
						variant="contained"
						onClick={() => navigate("/center")}
						data-cy="admin-button"
					>
						Admin Center
					</Button>
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
}

export default Home;
