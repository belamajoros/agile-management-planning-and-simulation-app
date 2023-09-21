import { Card } from "@mui/material";
import React, { useEffect } from "react";
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
import { BacklogCalculationProp } from "./sprintComponent";

interface SprintReviewProps {
	project: IProject;
	sprintNo: number;
	backlogs: Array<BacklogCalculationProp>;
}

export default function SimulationSprintReview(reviewProps: SprintReviewProps) {
	const [currentProject, setCurrentProject] = React.useState<IProject>();
	const [backlogs, setBacklogs] = React.useState<Array<IBacklog>>([]);
	const [tasks, setTasks] = React.useState<Array<ITask>>([]);
	const [workers, seWorkers] = React.useState<Array<IWorker>>([]);

	let sprintNumber = reviewProps.sprintNo;
	const { state } = useLocation();

	const getCurrentProject = () => {
		const currProject: IProject = reviewProps.project as IProject;
		if (currProject) {
			setCurrentProject(currProject);
		}
	};

	useEffect(() => {
		console.log(reviewProps.backlogs);
	}, [reviewProps.backlogs.length]);

	const getBacklogs = async () => {
		let tempBacklogList: Array<IBacklog> = [];
		if (currentProject) {
			if (currentProject._id != undefined) {
				await getProjectBacklogs(currentProject._id)
					.then((blg) => {
						for (const val of blg) {
							console.log(val);
							if (val.sprintNo === reviewProps.sprintNo) {
								tempBacklogList.push(val);
							}
						}
						setBacklogs(tempBacklogList);
					})
					.catch((e) => {
						console.log(e);
					});
			} else {
				console.log("No current project chosen!");
			}
		}
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
		console.log("WWWWWWWWWWW");
		if (currentProject) {
			if (currentProject._id != undefined) {
				await getProjectWorkers(currentProject._id)
					.then((wrk) => {
						console.log(wrk);
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
		if (currentProject) {
			getTasks();
			getBacklogs();
			getWorkers();
		}
		console.log(currentProject);
	}, [currentProject]);
	return (
		<div
			style={{ margin: "5%", borderBlockColor: "lightgray", borderRadius: 10 }}
		>
			<h1 data-cy="sprint-title">Sprint No. {reviewProps.sprintNo} </h1>
			<div>
				<h2>Done</h2>
				{backlogs ? (
					reviewProps.backlogs
						.map((backlog) => backlog.backlog)
						.filter((backlogRec) => backlogRec.progress === 100)
						.map((backlog) => (
							<BacklogCard backlog={backlog} tasks={tasks} workers={workers} />
						))
				) : (
					<div>No backlogs to load!</div>
				)}
			</div>
			<div>
				<h2>In progress</h2>
				{backlogs ? (
					reviewProps.backlogs
						.map((backlog) => backlog.backlog)
						.filter((backlogRec) =>
							backlogRec.progress! < 100 ? backlogRec.progress : 0
						)
						.map((backlog) => (
							<BacklogCard backlog={backlog} tasks={tasks} workers={workers} />
						))
				) : (
					<div>No backlogs to load!</div>
				)}
			</div>
		</div>
	);
}
