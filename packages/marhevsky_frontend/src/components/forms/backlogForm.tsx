import { Box, Button, Chip, Modal, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	createBacklog,
	getBacklogById,
	updateBacklog,
} from "../../api/backlogApi";
import { getProjectByCreatorId } from "../../api/projectApi";
import { getAllTasks } from "../../api/taskApi";
import { getAllWorkers } from "../../api/workerApi";
import Backlog from "../../classes/backlog";
import IBacklog from "../../interfaces/backlog";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";
import {
	addBacklogsToProject,
	addTasksToProject,
	addWorkersToProject,
} from "../../services/projectService";
import { getUserProjects } from "../../services/userService";
import TokenUtilService from "../../utils/token-util";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 550,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 10,
	boxShadow: 24,
	p: 4,
};

export default function BacklogForm() {
	const [tasks, setTasks] = React.useState<Array<ITask>>([]);
	const [workers, setWorkers] = React.useState<Array<IWorker>>([]);
	const [pickedTask, setPickedTask] = React.useState<string>("");
	const [pickedSprintNo, setPickedSprintNo] = React.useState<string>("");
	const [pickedWorkers, setPickedWorkers] = React.useState<Array<string>>([]);
	const [backlogProgress, setBacklogProgress] = React.useState<string>("");

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseBacklogId, setResponseBacklogId] = React.useState<string>("");
	const [pickedProject, setPickedProject] = React.useState<string>("");
	const [currentUserProjects, setCurrentUserProjects] = React.useState<
		Array<IProject>
	>([]);
	const [isProjectPickVisible, setIsProjectPickVisible] =
		React.useState<boolean>(true);

	const [canEdit, setCanEdit] = React.useState<boolean>(false);

	const { id } = useParams();
	const localUserId = TokenUtilService.getCurrentUserId();

	const getUserPrivilege = () => {
		if (id) {
			if (TokenUtilService.isAdmin()) {
				//ked je admin podmienka ...
				setCanEdit(true);
			} else {
				setCanEdit(false);
			}
		} else {
			setCanEdit(true);
		}
	};
	const getCurrentUserProjects = () => {
		if (localUserId) {
			getUserProjects(localUserId).then((proj) => {
				setCurrentUserProjects(proj);
			});
		}
	};

	const navigate = useNavigate();
	const navigateToNewBacklog = () => {
		if (responseBacklogId != "") {
			const path = `/simulation/backlog/` + responseBacklogId;
			navigate(path);
			handleCloseModal();
		}
	};

	const addToPickedProject = () => {
		setIsProjectPickVisible(true);
		const temp: Array<string> = [];
		if (pickedProject && responseBacklogId) {
			temp.push(responseBacklogId);
			addBacklogsToProject(pickedProject, temp).then((r) => {
				if (r === "ALREADY_EXIST") {
					setMessage("Backlog already assigned to this Project!");
					handleOpenModal();
				} else if (r === "") {
					setMessage("Could not add Backlog to this Project!");
					handleOpenModal();
				} else {
					navigate(`/simulation/project/` + pickedProject);
				}
			});
		} else {
			if (responseBacklogId) {
				setMessage("Please pick a Project!");
				handleOpenModal();
			}
		}
	};

	const getBacklog = async () => {
		if (id) {
			const data = await getBacklogById(id);
			if (data.progress && data.task && data.sprintNo) {
				if (data.worker) {
					setPickedWorkers(data.worker);
				}
				setBacklogProgress(data.progress.toString());
				setPickedTask(data.task);
				setPickedSprintNo(data.sprintNo.toString());
			}
		}
	};

	const getTasks = async () => {
		const data = await getAllTasks();
		setTasks(data);
	};
	const getWorkers = async () => {
		const data = await getAllWorkers();
		setWorkers(data);
	};

	const handleTaskChange = (event: SelectChangeEvent) => {
		setPickedTask(event.target.value);
	};
	const handleWorkerChange = (
		event: SelectChangeEvent<typeof pickedWorkers>
	) => {
		const {
			target: { value },
		} = event;

		setPickedWorkers(typeof value === "string" ? value.split(",") : value);
	};
	const handleProjectChange = (event: SelectChangeEvent) => {
		setPickedProject(event.target.value);
	};

	function getLabel(id: string) {
		for (let i = 0; i < workers.length; i++) {
			if (workers[i]._id === id) {
				return workers[i].name;
			}
		}
		return "";
	}
	function getTaskLabel(id: string): string {
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i]._id === id) {
				return tasks[i].title!;
			}
		}
		return "";
	}

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;

	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};

	React.useEffect(() => {
		getUserPrivilege();
		if (id) {
			getBacklog();
		}
		if (localUserId) {
			getCurrentUserProjects();
		}
		getWorkers();
		getTasks();
	}, []);
	return (
		<fieldset style={{ border: "none" }} disabled={!canEdit}>
			<div
				style={{
					border: "solid",
					borderRadius: 15,
					borderColor: "lightgray",
					margin: "5%",
				}}
				data-cy="backlog-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Backlog
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							task: { value: string };
							progress: { value: number };
							worker: { value: Array<string> };
							sprintNo: { value: number };
						};

						const task = pickedTask;
						const progress: number = +backlogProgress;
						const worker = pickedWorkers;
						const sprintNo: number = +pickedSprintNo;

						const newBacklog: IBacklog = new Backlog(
							progress,
							task,
							worker,
							sprintNo
						);

						if (!id) {
							createBacklog(newBacklog)
								.then((r) => {
									if (r._id) {
										setResponseBacklogId(r._id);
										setMessage("Backlog created successfully!");
										setIsProjectPickVisible(true);
										handleOpenModal();
									} else {
										setMessage("Could not create Backlog!");
										setIsProjectPickVisible(false);
										handleOpenModal();
									}
								})
								.catch((err) => {
									setMessage("Could not connect to Server!");
									setIsProjectPickVisible(false);
									handleOpenModal();
									console.log(err);
								});
						} else {
							const data = {
								task: task,
								worker: worker,
								progress: progress,
								sprintNo: sprintNo,
							};
							updateBacklog(id, data)
								.then((r) => {
									if (r._id) {
										setResponseBacklogId(r._id);
										setMessage("Backlog updated successfully!");
										setIsProjectPickVisible(true);
										handleOpenModal();
									} else {
										setMessage("Could not update Backlog!");
										setIsProjectPickVisible(false);
										handleOpenModal();
									}
								})
								.catch((err) => {
									setMessage("Could not connect to Server!");
									setIsProjectPickVisible(false);
									handleOpenModal();
									console.log(err);
								});
						}
					}}
				>
					<div style={{ margin: "1%" }}>
						<label>
							Progress : *<br />
							<TextField
								required
								style={{ minWidth: "100px" }}
								variant="outlined"
								InputProps={{ inputProps: { min: 0, max: 100 } }}
								type="number"
								name="progress"
								value={backlogProgress}
								onChange={(e) => setBacklogProgress(e.target.value)}
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							SprintNo : <br />
							<TextField
								style={{ minWidth: "100px" }}
								variant="outlined"
								type="number"
								InputProps={{ inputProps: { min: 0 } }}
								name="progress"
								value={pickedSprintNo}
								onChange={(e) => setPickedSprintNo(e.target.value)}
							/>
						</label>
					</div>
					<FormControl
						required
						style={{ margin: "1%", minWidth: "300px" }}
						disabled={!canEdit}
					>
						<InputLabel id="demo-simple-select-label">
							-- Pick Task --
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={pickedTask}
							label="Category"
							onChange={handleTaskChange}
							renderValue={(selected) => (
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
									}}
									onClick={() => navigate("/simulation/task/" + selected)}
								>
									{getTaskLabel(selected)}
								</div>
							)}
						>
							{tasks
								? tasks.map((task) => (
										<MenuItem key={task._id} value={task._id}>
											{task.title}
										</MenuItem>
								  ))
								: ""}
						</Select>
					</FormControl>
					<FormControl
						style={{ margin: "1%" }}
						sx={{ m: 1, minWidth: 500 }}
						disabled={!canEdit}
					>
						<InputLabel id="demo-multiple-checkbox-label">Workers</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedWorkers}
							onChange={handleWorkerChange}
							input={<OutlinedInput label="Workers" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip
											key={value}
											clickable={true}
											onMouseDown={(e) => {
												e.stopPropagation();
											}}
											onClick={() => navigate("/simulation/worker/" + value)}
											label={getLabel(value)}
										/>
									))}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{workers.map((name) => (
								<MenuItem key={name._id} value={name._id}>
									{name.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<div style={{ display: "flex", margin: "1%" }}>
						<Button
							size={"large"}
							style={{ marginRight: " 1%" }}
							variant="contained"
							type="submit"
							value="Submit"
							data-cy="submit-button"
						>
							Submit
						</Button>
						<Button
							name="createCategory"
							style={{ marginRight: " 1%" }}
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/task")}
						>
							Create new Task
						</Button>
						<Button
							name="createCategory"
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/worker")}
						>
							Create new Worker
						</Button>
					</div>
				</form>
			</div>
			<Modal
				open={openModalSubmit}
				onClose={handleOpenModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						style={{ margin: "3%", textAlign: "center" }}
						id="modal-modal-title"
						variant="h5"
						component="h2"
					>
						{message}
					</Typography>
					{isProjectPickVisible ? (
						<div>
							<FormControl style={{ margin: "5%", minWidth: "300px" }}>
								<InputLabel id="demo-simple-select-label">
									-- Pick Project --
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={pickedProject}
									label="Project"
									onChange={handleProjectChange}
								>
									{currentUserProjects
										? currentUserProjects.map((proj) => (
												<MenuItem key={proj._id} value={proj._id}>
													{proj.name}
												</MenuItem>
										  ))
										: ""}
								</Select>
							</FormControl>
							<div style={{ marginTop: "2%" }}>
								<Button
									style={{ display: "block", margin: "auto" }}
									size={"large"}
									variant="contained"
									onClick={addToPickedProject}
								>
									Add Backlog to Project
								</Button>
							</div>
						</div>
					) : (
						<div></div>
					)}
					<div style={{ display: "flex", marginTop: "5%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => {
								navigate(`/`);
								handleCloseModal();
							}}
						>
							Simulation
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => navigateToNewBacklog()}
						>
							Edit Backlog
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={handleCloseModal}
						>
							Close
						</Button>
					</div>
				</Box>
			</Modal>
		</fieldset>
	);
}
