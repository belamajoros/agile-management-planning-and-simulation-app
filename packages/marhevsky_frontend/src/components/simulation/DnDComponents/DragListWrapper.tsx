import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTaskById } from "../../../api/taskApi";
import IProject from "../../../interfaces/project";
import ITask from "../../../interfaces/task";
import DragList2 from "./DragList2";

function DragListWrapper() {
	const [currentProject, setCurrentProject] = React.useState<IProject>();
	const [allTasks, setAllTasks] = React.useState<Array<ITask>>([]);

	const { state } = useLocation();

	const getCurrentProject = () => {
		const project: IProject = state as IProject;
		if (project) {
			setCurrentProject(project);
			console.log(project);
		} else {
			console.log("Nebol passnuty projekt pre vykreslenie!");
		}
	};

	const getTasks = async () => {
		if (currentProject) {
			let temp: Array<ITask> = [];
			if (currentProject.tasks) {
				for (const task of currentProject.tasks) {
					await getTaskById(task)
						.then((data) => {
							temp.push(data);
						})
						.catch((e) => {
							console.log(e);
						});
				}
			}
			setAllTasks(temp);
			console.log(temp);
		} else {
			console.log("no tasks assigned to this project !");
		}
		console.log(allTasks);
	};

	useEffect(() => {
		getCurrentProject();
		if (currentProject) {
			getTasks();
		}
	}, [currentProject]);

	return (
		<div>
			{currentProject && allTasks && allTasks.length > 0 ? (
				<DragList2 currentProject={currentProject} allTasks={allTasks} />
			) : (
				<></>
			)}
		</div>
	);
}

export default DragListWrapper;
