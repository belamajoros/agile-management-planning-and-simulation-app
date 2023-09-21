import { Card } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import IBacklog from "../../interfaces/backlog";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";

interface BacklogProps {
	backlog: IBacklog;
	tasks: Array<ITask>;
	workers: Array<IWorker>;
}

export default function BacklogCard(backlogProps: BacklogProps) {
	let navigate = useNavigate();
	const openBacklog = (id: string | undefined) => {
		let path = `/simulation/backlog/` + id;
		navigate(path);
	};

	return (
		<div>
			<Card
				onClick={() => openBacklog(backlogProps.backlog._id)}
				key={backlogProps.backlog._id}
				style={{ margin: "1%", backgroundColor: "lightgray" }}
			>
				{backlogProps.tasks
					.filter((task) => task._id === backlogProps.backlog.task)
					.map((tsk) => (
						<h3>{tsk.title}</h3>
					))}
				{backlogProps.backlog.progress} <br />
				{backlogProps.backlog.worker ? (
					backlogProps.backlog.worker.map((wrkId) => (
						<div>
							{backlogProps.workers
								.filter((worker) => worker._id === wrkId)
								.map((wrk) => (
									<div>{wrk.name}</div>
								))}
						</div>
					))
				) : (
					<div>No worker assigned.</div>
				)}
			</Card>
		</div>
	);
}
