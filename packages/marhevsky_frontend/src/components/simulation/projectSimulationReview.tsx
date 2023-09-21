import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IBacklog from "../../interfaces/backlog";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";
import {
	getProjectBacklogs,
	getProjectTasks,
	getProjectWorkers,
} from "../../services/projectService";
import BacklogCard from "./backlogCard";

export default function ProjectSimulationReview() {
	const [currentProject, setCurrentProject] = React.useState<IProject>();
	const [backlogs, setBacklogs] = React.useState<Array<IBacklog>>([]);
	const [tasks, setTasks] = React.useState<Array<ITask>>([]);
	const [workers, seWorkers] = React.useState<Array<IWorker>>([]);
	const [totalSprintNo, setTotalSprintNo] = React.useState<number>(1);

	const { state } = useLocation();

	const getCurrentProject = () => {
		const currProject: IProject = state as IProject;
		if (currProject) {
			setCurrentProject(currProject);
		}
	};

	const getBacklogs = async () => {
		if (currentProject) {
			if (currentProject._id) {
				await getProjectBacklogs(currentProject._id)
					.then((blg) => {
						blg = blg
							.reverse()
							.filter(
								(thing, index, self) =>
									self.findIndex(
										(t) =>
											t.task === thing.task && t.sprintNo === thing.sprintNo
									) === index
							);
						blg = blg.reverse();
						setBacklogs(blg);
						const sprintNo = blg.reduce((acc, backlog) => {
							return acc > backlog.sprintNo! ? acc : backlog.sprintNo!;
						}, 1);
						setTotalSprintNo(sprintNo);
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				console.log("No current project chosen!");
			}
		}
		console.log(backlogs);
	};

	const getTasks = async () => {
		if (currentProject) {
			if (currentProject._id != undefined) {
				await getProjectTasks(currentProject._id)
					.then((tsk) => {
						setTasks(tsk);
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				console.log("No current project chosen!");
			}
		}
	};
	const getWorkers = async () => {
		if (currentProject) {
			if (currentProject._id != undefined) {
				await getProjectWorkers(currentProject._id)
					.then((wrk) => {
						seWorkers(wrk);
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				console.log("No current project chosen!");
			}
		}
	};
	let navigate = useNavigate();
	const openBacklog = (id: string | undefined) => {
		let path = `/simulation/backlog/` + id;
		navigate(path);
	};

	useEffect(() => {
		getCurrentProject();
		getBacklogs().then(() => {
			getTasks();
			getWorkers();
		});
	}, [currentProject, backlogs.length]);
	return (
		<div
			style={{ margin: "5%", borderBlockColor: "lightgray", borderRadius: 10 }}
		>
			<h1 data-cy="projReview">Project review</h1>
			{[...Array(totalSprintNo).keys()].map((key) => (
				<div>
					<h1>Sprint No. {key + 1} </h1>
					<h3>Done</h3>
					{backlogs ? (
						backlogs
							.filter(
								(backlogRec) =>
									backlogRec.sprintNo === key + 1 &&
									backlogRec.progress! === 100
							)
							.map((completedBacklog) => (
								<div>
									<BacklogCard
										backlog={completedBacklog}
										tasks={tasks}
										workers={workers}
									/>
								</div>
							))
					) : (
						<div>No backlogs</div>
					)}
					<h3>In progress</h3>
					{backlogs ? (
						backlogs
							.filter(
								(backlogRec) =>
									backlogRec.sprintNo === key + 1 && backlogRec.progress! < 100
							)
							.map((incompleteBacklog) => (
								<div>
									<BacklogCard
										backlog={incompleteBacklog}
										tasks={tasks}
										workers={workers}
									/>
								</div>
							))
					) : (
						<div>No backlogs</div>
					)}
				</div>
			))}
		</div>
	);
}
