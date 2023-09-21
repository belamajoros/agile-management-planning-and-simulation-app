import * as React from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";
import TokenUtilService from "../../utils/token-util";
import ChatComponent from "./chat";
import {
	BacklogCalculationProp,
	IncomingBacklog,
	SprintComponent,
} from "./sprintComponent";

interface IStateProps {
	element: Array<TaskProp>;
	project: IProject;
	sprintCapacity: number;
}

interface TaskProp {
	[key: string]: Array<TaskContentProp>;
}

export interface TaskContentProp {
	id: string;
	prefix: string;
	task: ITask;
}

export default function AssignTasks() {
	const [currentProject, setCurrentProject] = React.useState<IProject>();
	const [workers, setWorkers] = React.useState<Array<IWorker>>([]);
	const [allTasks, setAllTasks] = React.useState<Array<ITask>>([]);
	const [sprintTasks, setSprintTasks] = React.useState<Array<ITask>>([]);
	const [backlogProps, setBacklogProps] = React.useState<
		Map<string, Array<IncomingBacklog>>
	>(new Map());
	const [sprintSet, setSprintsSet] = React.useState<Set<string>>(new Set());

	let initialised = false;
	const { state } = useLocation();

	const socket = useContext(SocketContext);
	const userId = TokenUtilService.getCurrentUserId();

	const navigate = useNavigate();

	const openSprintReview = () => {
		let path = `/simulate/reviewSprint`;
		navigate(path, { state: currentProject });
	};
	const sprints = state as IStateProps;
	const getSprints = (sprint: string) => {
		if (sprints) {
			setCurrentProject(sprints.project);
			//setSprintTasks(sprints.element[0].task as Array<ITask>);
			console.log(sprints.element);
		} else {
			console.log("Nebol passnuty projekt pre vykreslenie!");
		}
		console.log(state);
	};
	const getTasksBySprint = (sprint: string): Array<TaskContentProp> => {
		if (sprints) {
			console.log(sprints.element[sprint].task);
			return sprints.element[sprint];
		}
		return [];
	};

	const initBacklog = () => {
		const newProps = backlogProps;
		const sprintProp = sprintSet;
		Object.getOwnPropertyNames(sprints.element)
			.filter((prop) => prop !== "Tasks")
			.map((sprint) => {
				const tasks = getTasksBySprint(sprint);
				const tasksMap = tasks.map((task) => {
					return {
						backlog: {
							task: task.task._id,
							worker: [],
							progress: 0,
							sprintNo: +sprint.split(" ")[1],
						},
						task: task,
					} as IncomingBacklog;
				});
				newProps.set(sprint, tasksMap);
				sprintProp.add(sprint);
			});
		setSprintsSet(sprintProp);
		setBacklogProps(newProps);
		return <div></div>;
	};

	/* const renderTasks = () => {
		if (currentProject) {
			return (
				<SprintComponent
					sprints={Array.from(sprintSet)}
					backlogTasks={backlogProps}
					project={currentProject}
					sprintCapacity={sprints.sprintCapacity}
				/>
			);
		} else {
			return <div></div>;
		}
	}; */

	const renderTasks = () => {
		if (currentProject) {
			return (
				<>
					<SprintComponent
						sprints={Array.from(sprintSet)}
						backlogTasks={backlogProps}
						project={currentProject}
						sprintCapacity={sprints.sprintCapacity}
					/>
					{currentProject._id &&
					currentProject.collaborators &&
					currentProject.collaborators.length > 0 ? (
						<ChatComponent room={currentProject._id} />
					) : null}
				</>
			);
		} else {
			return <div></div>;
		}
	};

	const renderHeader = (sprint: string) => {
		return <h2>{sprint}</h2>;
	};

	/*  React.useEffect(() => {
        if (currentProject) {
			socket.emit("join_simulation", {
				id: currentProject._id,
				user_id: userId,
			});
		}
    },[]) */

	React.useEffect(() => {
		if (currentProject) {
			socket.emit("join_simulation", {
				id: currentProject._id,
				user_id: userId,
			});
		}
		getSprints("Sprint 1");

		return () => {
			if (currentProject) {
				socket.emit("disconnect_room", currentProject._id);
			}
		};
	}, [currentProject]);
	return <div>{sprintSet.size >= 1 ? renderTasks() : initBacklog()}</div>;
}
