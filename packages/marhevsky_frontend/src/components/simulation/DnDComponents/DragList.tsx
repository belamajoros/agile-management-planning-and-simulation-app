import { Button, Fab } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useCallback, useContext, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import { getTaskById } from "../../../api/taskApi";
import { SocketContext } from "../../../context/socket";
import { GroupChatMessages } from "../../../interfaces/chat";
import IProject from "../../../interfaces/project";
import ITask from "../../../interfaces/task";
import "../../../style/Chat.css";
import TokenUtilService from "../../../utils/token-util";
import ChatComponent from "../chat";
import DraggableElement from "./DraggableElement";

const getItems = (tasks: Array<ITask>, prefix: string) =>
	tasks.map((task) => {
		return {
			id: task._id,
			prefix: prefix,
			task: task,
		};
	});

const removeFromList = (list: any, index: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(index, 1);
	return [removed, result];
};

const addToList = (list: any, index: number, element: unknown) => {
	const result = Array.from(list);
	result.splice(index, 0, element);
	return result;
};

/* let lists = ["Tasks"]; */

interface ISprint {
	id: string;
	prefix: string;
	task: ITask;
}

interface IElements {
	Tasks: ISprint[];
	[sprintName: string]: ISprint[];
}

function DragList() {
	const [lists, setLists] = React.useState(["Tasks"]);
	const [sprintNo, setSprintNo] = React.useState(1);
	const [sprintCapacity, setSprintCapacity] = React.useState(100);
	const [currentProject, setCurrentProject] = React.useState<IProject>();
	const [allTasks, setAllTasks] = React.useState<Array<ITask>>([]);
	const [isHidden, setIsHidden] = React.useState(true);
	const [currentTeamSize, setCurrentTeamSize] = React.useState<number>(0);
	const [teamSize, setTeamSize] = React.useState<number>(0);

	const socket = useContext(SocketContext);
	const { state } = useLocation();

	const userId = TokenUtilService.getCurrentUserId();

	/* const generateLists = () =>
		lists.reduce(
			(acc, listKey) => ({
				...acc,
				[listKey]: listKey === "Tasks" ? getItems(allTasks, listKey) : [],
			}),
			{}
		); */

	const generateLists = (lists: string[]) =>
		lists.reduce(
			(acc, listKey) => ({
				...acc,
				[listKey]: listKey === "Tasks" ? getItems(allTasks, listKey) : [],
			}),
			{}
		);

	/* const [elements, setElements] = React.useState(generateLists()); */
	const [elements, setElements] = React.useState({});

	const getCurrentProject = () => {
		const project: IProject = state as IProject;
		if (project) {
			setCurrentProject(project);
			if (project.collaborators) {
				setTeamSize(project.collaborators.length + 1);
			} else {
				setTeamSize(1);
			}
		} else {
			console.log("Nebol passnuty projekt pre vykreslenie!");
		}
	};

	let navigate = useNavigate();

	const clickOpenBacklog = (elements: IElements) => {
		if (elements.Tasks.length > 0) {
			alert("You have to assign every task to a sprint!");
		} else {
			if (currentProject) {
				socket.emit("send_open_backlog", {
					id: currentProject._id,
					elements: elements,
				});
			}
			openBacklog(elements);
		}
	};

	const openBacklog = useCallback(
		(elements: {}) => {
			let path = `/simulate/backlog`;
			console.log(currentProject);
			navigate(path, {
				state: {
					element: elements,
					project: currentProject,
					sprintCapacity: sprintCapacity,
				},
			});
		},
		[currentProject, sprintCapacity]
	);

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
		} else {
			console.log("no tasks assigned to this project !");
		}
		console.log(allTasks);
	};

	const onDragEnd = (result: any) => {
		if (!result.destination) {
			return;
		}
		const listCopy = { ...elements };

		// @ts-ignore
		const sourceList = listCopy[result.source.droppableId];
		const [removedElement, newSourceList] = removeFromList(
			sourceList,
			result.source.index
		);
		// @ts-ignore
		listCopy[result.source.droppableId] = newSourceList;
		// @ts-ignore
		const destinationList = listCopy[result.destination.droppableId];
		// @ts-ignore
		listCopy[result.destination.droppableId] = addToList(
			destinationList,
			result.destination.index,
			removedElement
		);

		setElements(listCopy);

		if (currentProject) {
			socket.emit("dragdrop_update", {
				elements: listCopy,
				id: currentProject._id,
			});
		}
	};

	const sprintsSelected = (value: number) => {
		console.log(Object.keys(elements).length);
		console.log(elements);
		console.log(lists);
		console.log(lists.length);
		if (currentProject) {
			socket.emit("sprint_num", { sprintNum: value, id: currentProject._id });
			setIsHidden(false);
		}
	};

	useEffect(() => {
		getCurrentProject();
		if (currentProject) {
			getTasks();
			socket.emit("join_simulation", {
				id: currentProject._id,
				user_id: userId,
			});
		}
	}, [currentProject]);

	useEffect(() => {
		const newList = ["Tasks"];
		for (let i = 0; i < sprintNo; i++) {
			newList.push("Sprint " + (i + 1));
		}
		setLists(newList);
		setElements(generateLists(newList));
	}, [sprintNo]);

	/* useEffect(() => {
		getCurrentProject();
		if (currentProject) {
			getTasks();
		}
		lists = ["Tasks"];
		for (let i = 0; i < sprintNo; i++) {
			lists.push("Sprint " + (i + 1));
		}
		setElements(generateLists());

		if (currentProject) {
			socket.emit("join_simulation", {
				id: currentProject._id,
				user_id: userId,
			});
		}
	}, [currentProject, sprintNo]); */
	const handleJoinedTeammate = useCallback(() => {
		if (
			teamSize === currentTeamSize &&
			Object.keys(elements).length > 1 &&
			currentProject &&
			!isHidden
		) {
			socket.emit("sprint_num", {
				sprintNum: sprintNo,
				id: currentProject._id,
			});
			socket.emit("dragdrop_update", {
				elements: elements,
				id: currentProject._id,
			});
		}
	}, [elements, teamSize, currentTeamSize, sprintNo, currentProject, isHidden]);

	const handleReceiveSprintNum = (sprintNum: number) => {
		setSprintNo(sprintNum);
		setIsHidden(false);
	};

	const handleReceiveDragdropUpdate = (elements: IElements) => {
		setElements(elements);
	};

	/* const handleReceiveOpenBacklog = useCallback(() => {
		console.log("open backlog");
		console.log(elements);
		openBacklog(elements);
	}, [elements, openBacklog]); */
	const handleReceiveOpenBacklog = (elements: IElements) => {
		openBacklog(elements);
	};

	const handleRoomCount = (count: number) => {
		setCurrentTeamSize(count);
	};

	useEffect(() => {
		console.log(state);
	}, []);

	useEffect(() => {
		socket.on("joined_teamate", handleJoinedTeammate);
		socket.on("receive_sprint_num", handleReceiveSprintNum);
		socket.on("receive_dragdrop_update", handleReceiveDragdropUpdate);
		socket.on("receive_open_backlog", handleReceiveOpenBacklog);
		socket.on("room_count", handleRoomCount);
	}, [socket, handleJoinedTeammate]);

	useEffect(() => {
		return () => {
			if (currentProject) {
				socket.emit("disconnect_room", currentProject._id);
				socket.off("joined_teamate", handleJoinedTeammate);
				socket.off("receive_sprint_num", handleReceiveSprintNum);
				socket.off("receive_dragdrop_update", handleReceiveDragdropUpdate);
				socket.off("receive_open_backlog", handleReceiveOpenBacklog);
				socket.off("room_count", handleRoomCount);
			}
		};
	}, [currentProject]);

	return (
		<>
			<div style={{ marginTop: "5%" }}>
				{currentTeamSize !== teamSize ? (
					<div
						style={{
							alignItems: "center",
							justifyContent: "center",
							display: "flex",
							marginTop: "10%",
						}}
					>
						<CircularProgress />
						<h2 data-cy="wait-for-others">
							Waiting for your teamate(s) to join... {currentTeamSize}/
							{teamSize}
						</h2>
					</div>
				) : (
					<>
						<div>
							<form
								onSubmit={(e: React.SyntheticEvent) => {
									e.preventDefault();
									const target = e.target as typeof e.target & {
										sprintNo: { value: number };
									};
									sprintsSelected(target.sprintNo.value);
								}}
							>
								<label>
									Pick No. of Sprints per Project :
									<input
										type="number"
										name="sprintNo"
										/* defaultValue={sprintNo} */
										value={sprintNo}
										min={1}
										onChange={(e) => setSprintNo(Number(e.target.value))}
										data-cy="pick-sprint-num"
									/>
								</label>
								<div style={{ margin: "1%" }}>
									<Button
										size={"large"}
										variant="contained"
										type="submit"
										value="Submit"
										data-cy="submit"
									>
										Submit
									</Button>
								</div>
							</form>
						</div>
						{!isHidden && Object.keys(elements).length === lists.length ? (
							<div className="dragdrop" hidden={isHidden} data-cy="drag-list">
								<DragDropContext onDragEnd={onDragEnd}>
									<div style={{ display: "flex" }}>
										{lists.map((listKey) => (
											<DraggableElement
												// @ts-ignore
												elements={elements[listKey]}
												key={listKey}
												prefix={listKey}
											/>
										))}
									</div>
								</DragDropContext>

								<Button
									style={{ margin: "1%" }}
									variant="contained"
									size={"large"}
									name="project/backlog"
									onClick={() => clickOpenBacklog(elements as IElements)}
									data-cy="nextbutton"
								>
									Next
								</Button>
							</div>
						) : null}
					</>
				)}
			</div>
			{currentProject && currentProject._id && teamSize > 1 ? (
				<ChatComponent room={currentProject._id} />
			) : null}
		</>
	);
}

export default DragList;
