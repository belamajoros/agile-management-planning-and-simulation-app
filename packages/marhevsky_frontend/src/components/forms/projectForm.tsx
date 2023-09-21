import {
	Box,
	Button,
	Checkbox,
	Chip,
	FormControlLabel,
	Modal,
	TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllBacklogs } from "../../api/backlogApi";
import {
	createProject,
	getProjectById,
	updateProject,
} from "../../api/projectApi";
import { getAllTasks } from "../../api/taskApi";
import { getAllUsers } from "../../api/userApi";
import { getAllWorkers } from "../../api/workerApi";
import Project from "../../classes/project";
import IBacklog from "../../interfaces/backlog";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import IUser from "../../interfaces/user";
import IWorker from "../../interfaces/worker";
import { addUserProject } from "../../services/userService";
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

export default function ProjectForm() {
	const [tasks, setTasks] = React.useState<Array<ITask>>([]);
	const [workers, setWorkers] = React.useState<Array<IWorker>>([]);
	const [backlogs, setBacklogs] = React.useState<Array<IBacklog>>([]);

	const [pickedBacklogs, setPickedBacklogs] = React.useState<Array<string>>([]);
	const [pickedTasks, setPickedTasks] = React.useState<Array<string>>([]);
	const [pickedWorkers, setPickedWorkers] = React.useState<Array<string>>([]);
	const [pickedCollaborators, setPickedCollaborators] = React.useState<
		Array<string>
	>([]);

	const [projectName, setProjectName] = React.useState<string>("");
	const [projectDesc, setProjectDesc] = React.useState<string>("");
	const [projectIsTemplate, setProjectIsTemplate] =
		React.useState<boolean>(false);

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const [allUsers, setAllUsers] = React.useState<Array<IUser>>([]);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseProjectId, setResponseProjectId] = React.useState<string>("");

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

	const getProject = async () => {
		if (id) {
			const data = await getProjectById(id);
			console.log(data);
			if (data.name && data.description) {
				setProjectName(data.name);
				setProjectDesc(data.description);
				if (data.team) {
					setPickedWorkers(data.team);
				}
				if (data.backlogs) {
					setPickedBacklogs(data.backlogs);
				}
				if (data.tasks) {
					setPickedTasks(data.tasks);
				}

				if (data.template) {
					setProjectIsTemplate(data.template);
				}
				if (data.collaborators) {
					console.log(allUsers);
					const collaborators = allUsers
						.filter(
							(user) =>
								user._id !== undefined && data.collaborators?.includes(user._id)
						)
						.map((user) => user.email)
						.filter((email) => email !== undefined) as string[];
					setPickedCollaborators(collaborators);
					console.log(collaborators);
				}
				if (localUserId && data.creator) {
					if (data.creator === localUserId) {
						setCanEdit(true);
					}
				}
			}
		}
	};

	const getTasks = async () => {
		let tempTasks: Array<ITask> = [];
		const data = await getAllTasks();
		if (data) {
			data.forEach((val) => {
				if (val.title) {
					tempTasks.push(val);
				}
			});
		}
		setTasks(tempTasks);
	};

	const getAllExistingUsers = async () => {
		await getAllUsers().then((data) => {
			console.log(data);
			setAllUsers(data);
		});
	};

	const getWorkers = async () => {
		const data = await getAllWorkers();
		setWorkers(data);
	};
	const getBacklogs = async () => {
		const data = await getAllBacklogs();
		setBacklogs(data);
	};

	const navigate = useNavigate();
	const navigateToNewProject = () => {
		if (responseProjectId != "") {
			const path = `/simulation/project/` + responseProjectId;
			navigate(path);
			handleCloseModal();
		}
	};
	const addToMyProjects = () => {
		handleCloseModal();
		if (localUserId && responseProjectId) {
			addUserProject(localUserId, responseProjectId).then((r) => {
				if (r === "ALREADY_EXIST") {
					setMessage("You already have this project assigned!");
					handleOpenModal();
				} else if (r === "") {
					setMessage("Could not add project to My projects!");
					handleOpenModal();
				} else {
					navigate(`/simulation/simulate`);
				}
				console.log(r);
			});
		}
	};

	const handleTaskChange = (event: SelectChangeEvent<typeof pickedWorkers>) => {
		const {
			target: { value },
		} = event;

		setPickedTasks(typeof value === "string" ? value.split(",") : value);
	};
	const handleWorkerChange = (
		event: SelectChangeEvent<typeof pickedWorkers>
	) => {
		const {
			target: { value },
		} = event;

		setPickedWorkers(typeof value === "string" ? value.split(",") : value);
	};
	const handleBacklogChange = (
		event: SelectChangeEvent<typeof pickedWorkers>
	) => {
		const {
			target: { value },
		} = event;

		setPickedBacklogs(typeof value === "string" ? value.split(",") : value);
	};

	const handleCollaboratorsChange = (
		event: SelectChangeEvent<typeof pickedCollaborators>
	) => {
		const {
			target: { value },
		} = event;

		setPickedCollaborators(
			typeof value === "string" ? value.split(",") : value
		);
		console.log(pickedCollaborators);
	};

	function isTemplateRadio() {
		setProjectIsTemplate((value) => !value);
	}

	function getTaskLabel(id: string) {
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i]._id === id) {
				return tasks[i].title;
			}
		}
		return null;
	}

	function getBacklogLabel(id: string) {
		let taskProgress: string = "";
		for (let i = 0; i < backlogs.length; i++) {
			if (backlogs[i]._id === id) {
				if (backlogs[i].task) {
					let taskId = backlogs[i].task;
					if (taskId) {
						let taskLabel = getTaskLabel(taskId);
						if (taskLabel) {
							return taskLabel + " - " + backlogs[i].progress;
						}
					}
				}

				return null;
			}
		}
		return null;
	}

	function getWorkerLabel(id: string): string | null {
		for (let i = 0; i < workers.length; i++) {
			if (workers[i]._id === id) {
				return workers[i].name!;
			}
		}
		return null;
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
		if (id) {
			getProject();
		}
	}, [allUsers]);

	React.useEffect(() => {
		getAllExistingUsers();
		getUserPrivilege();
		getWorkers();
		getTasks();
		getBacklogs();
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
				data-cy="project-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Project
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							name: { value: string };
							description: { value: string };
							tasks: { value: Array<string> };
							backlogs: { value: Array<string> };
							team: { value: Array<string> };
							template: { value: boolean };
						};

						const name = projectName;
						const description = projectDesc;
						const backlogs = pickedBacklogs;
						const tasks = pickedTasks;
						const team = pickedWorkers;
						const isTemplate = projectIsTemplate;
						const userIds = allUsers
							.filter(
								(user) => user.email && pickedCollaborators.includes(user.email)
							)
							.map((user) => user._id)
							.filter((id) => id !== undefined) as string[];
						let creator = localUserId;

						if (creator) {
							const newProject: IProject = new Project(
								backlogs,
								creator,
								description,
								name,
								tasks,
								team,
								isTemplate,
								userIds
							);

							if (!id) {
								createProject(newProject)
									.then((r) => {
										if (r._id) {
											setResponseProjectId(r._id);
											console.log(r._id);
											setMessage("Project created successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not create Project!");
											handleOpenModal();
										}
									})
									.catch((err) => {
										setMessage("Could not connect to Server!");
										handleOpenModal();
										console.log(err);
									});
							} else {
								const data = {
									name: name,
									description: description,
									creator: creator,
									tasks: tasks,
									team: team,
									backlogs: backlogs,
									template: isTemplate,
									collaborators: userIds,
								};
								updateProject(id, data)
									.then((r) => {
										if (r._id) {
											setResponseProjectId(r._id);
											setMessage("Project updated successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not update Project!");
											handleOpenModal();
										}
									})
									.catch((err) => {
										setMessage("Could not connect to Server!");
										handleOpenModal();
										console.log(err);
									});
							}
						}
					}}
				>
					<div style={{ margin: "1%" }}>
						<label>
							Name : *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="name"
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								data-cy="project-name-input"
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							Description : *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="description"
								value={projectDesc}
								onChange={(e) => setProjectDesc(e.target.value)}
								data-cy="project-description-input"
							/>
						</label>
					</div>

					<FormControl sx={{ m: 1, width: 500 }} disabled={!canEdit}>
						<InputLabel id="demo-multiple-checkbox-label">Tasks</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedTasks}
							onChange={handleTaskChange}
							input={<OutlinedInput label="Tasks" />}
							data-cy="select-tasks"
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => {
										if (getTaskLabel(value) != null)
											return (
												<Chip
													key={value}
													clickable={true}
													onMouseDown={(e) => {
														e.stopPropagation();
													}}
													onClick={() => navigate("/simulation/task/" + value)}
													label={getTaskLabel(value)}
												/>
											);
									})}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{tasks.map((task) => (
								<MenuItem
									key={task._id}
									value={task._id}
									data-cy="select-tasks-item"
								>
									{task.title}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl sx={{ m: 1, width: 500 }} disabled={!canEdit}>
						<InputLabel id="demo-multiple-checkbox-label">Backlogs</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedBacklogs}
							onChange={handleBacklogChange}
							input={<OutlinedInput label="Backlogs" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip
											key={value}
											clickable={true}
											onMouseDown={(e) => {
												e.stopPropagation();
											}}
											onClick={() => navigate("/simulation/backlog/" + value)}
											label={getBacklogLabel(value)}
										/>
									))}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{backlogs.map((backlog) => (
								<MenuItem key={backlog._id} value={backlog._id}>
									{getTaskLabel(backlog.task!)} - {backlog.progress}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl sx={{ m: 1, width: 500 }} disabled={!canEdit}>
						<InputLabel id="demo-multiple-checkbox-label">Team</InputLabel>
						<Select
							style={{ zIndex: 1000 }}
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedWorkers}
							onChange={handleWorkerChange}
							input={<OutlinedInput label="Team" />}
							data-cy="select-team"
							renderValue={(selected) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
										zIndex: 100,
									}}
								>
									{selected.map((value) => (
										<Chip
											key={value}
											clickable={true}
											onMouseDown={(e) => {
												e.stopPropagation();
											}}
											label={getWorkerLabel(value)}
											onClick={() => navigate("/simulation/worker/" + value)}
										/>
									))}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{workers.map((worker) => (
								<MenuItem
									key={worker._id}
									value={worker._id}
									data-cy="select-team-item"
								>
									{worker.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, width: 500 }} disabled={!canEdit}>
						<InputLabel id="demo-multiple-checkbox-label">
							Collaborators
						</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedCollaborators}
							onChange={handleCollaboratorsChange}
							input={<OutlinedInput label="Collaborators" />}
							data-cy="select-collaborators"
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{allUsers.map((data) => {
								if (data.hasOwnProperty("email") && data._id !== localUserId) {
									return (
										<MenuItem key={data._id} value={data.email}>
											{data.email}
										</MenuItem>
									);
								} else {
									return <div></div>;
								}
							})}
						</Select>
					</FormControl>
					<div style={{ margin: "1%" }}>
						<FormControlLabel
							control={
								<Checkbox
									size={"medium"}
									checked={projectIsTemplate}
									onChange={isTemplateRadio}
									data-cy="template-checkbox"
								/>
							}
							label="Template project"
						/>
					</div>
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
							name="createTask"
							style={{ marginRight: " 1%" }}
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/task")}
							data-cy="task-button"
						>
							Create new Task
						</Button>
						<Button
							name="createWorker"
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/worker")}
							data-cy="worker-button"
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
						data-cy="modal-message"
					>
						{message}
					</Typography>
					<div style={{ display: "flex", marginTop: "5%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => {
								navigate(`/simulation/simulate`);
								handleCloseModal();
							}}
						>
							Simulation
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => navigateToNewProject()}
							data-cy="edit-project"
						>
							Edit Project
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
					<div style={{ marginTop: "2%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={addToMyProjects}
						>
							Add project to My projects
						</Button>
					</div>
				</Box>
			</Modal>
		</fieldset>
	);
}
