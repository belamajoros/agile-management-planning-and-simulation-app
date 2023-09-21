import { Box, Button, Modal, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategories } from "../../api/categoryApi";
import { getProjectByCreatorId } from "../../api/projectApi";
import { createTask, getTaskById, updateTask } from "../../api/taskApi";
import Task from "../../classes/task";
import ICategory from "../../interfaces/category";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import { addTasksToProject } from "../../services/projectService";
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

export default function TaskForm() {
	const [categories, setCategories] = React.useState<Array<ICategory>>([]);
	const [pickedCategory, setPickedCategory] = React.useState<string>("");

	const [taskDesc, setTaskDesc] = React.useState<string>("");
	const [taskTitle, setTaskTitle] = React.useState<string>("");
	const [taskEst, setTaskEst] = React.useState<string>("");
	const [taskPriority, setTaskPriority] = React.useState<string>("");

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseTaskId, setResponseTaskId] = React.useState<string>("");
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
	const navigateToNewTask = () => {
		if (responseTaskId != "") {
			const path = `/simulation/task/` + responseTaskId;
			navigate(path);
			handleCloseModal();
		}
	};

	const addToPickedProject = () => {
		setIsProjectPickVisible(true);
		handleCloseModal();
		const temp: Array<string> = [];
		if (pickedProject && responseTaskId) {
			temp.push(responseTaskId);
			addTasksToProject(pickedProject, temp).then((r) => {
				if (r === "ALREADY_EXIST") {
					setMessage("Task already assigned to this Project!");
					handleOpenModal();
				} else if (r === "") {
					setMessage("Could not add Task to this Project!");
					handleOpenModal();
				} else {
					navigate(`/simulation/project/` + pickedProject);
				}
			});
		} else {
			if (responseTaskId) {
				setMessage("Please pick a Project!");
				handleOpenModal();
			}
		}
	};

	const getTask = async () => {
		if (id) {
			const data = await getTaskById(id);
			if (data.title && data.description && data.estimation && data.category) {
				setTaskTitle(data.title);
				setTaskDesc(data.description);
				setTaskEst(data.estimation.toString());
				if (data.priority) {
					setTaskPriority(data.priority.toString());
				}
				setPickedCategory(data.category);

				if (localUserId && data.creator) {
					if (data.creator === localUserId) {
						setCanEdit(true);
					}
				}
			}
		}
	};

	const getCategories = async () => {
		const data = await getAllCategories();
		setCategories(data);
	};
	function getCategoryLabel(id: string): string {
		for (let i = 0; i < categories.length; i++) {
			if (categories[i]._id === id) {
				return categories[i].name!;
			}
		}
		return "";
	}

	React.useEffect(() => {
		getUserPrivilege();
		if (id) {
			getTask();
		}
		if (localUserId) {
			getCurrentUserProjects();
		}
		getCategories();
	}, []);

	const handleChange = (event: SelectChangeEvent) => {
		setPickedCategory(event.target.value);
	};
	const handleProjectChange = (event: SelectChangeEvent) => {
		setPickedProject(event.target.value);
	};

	return (
		<fieldset style={{ border: "none" }} disabled={!canEdit}>
			<div
				style={{
					border: "solid",
					borderRadius: 15,
					borderColor: "lightgray",
					margin: "5%",
				}}
				data-cy="task-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Task
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							title: { value: string };
							description: { value: string };
							estimation: { value: number };
							priority: { value: number };
							category: { value: string };
						};
						const title = taskTitle;
						const description = taskDesc;
						const estimation: number = +taskEst;
						const priority: number = +taskPriority;
						const category = pickedCategory;
						const creator = TokenUtilService.getCurrentUserId();

						if (creator) {
							const newTask: ITask = new Task(
								category,
								creator,
								title,
								description,
								estimation,
								priority
							);
							if (!id) {
								createTask(newTask)
									.then((r) => {
										if (r._id) {
											setResponseTaskId(r._id);
											setMessage("Task created successfully!");
											setIsProjectPickVisible(true);
											handleOpenModal();
										} else {
											setMessage("Could not create Task!");
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
									title: title,
									description: description,
									priority: priority,
									estimation: estimation,
									category: category,
									creator: creator,
								};
								updateTask(id, data)
									.then((r) => {
										if (r._id) {
											setResponseTaskId(r._id);
											setMessage("Task updated successfully!");
											setIsProjectPickVisible(true);
											handleOpenModal();
										} else {
											setMessage("Could not update Task!");
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
						}
					}}
				>
					<div style={{ margin: "1%" }}>
						<label>
							Title : *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="title"
								value={taskTitle}
								onChange={(e) => setTaskTitle(e.target.value)}
								data-cy="task-name-input"
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
								value={taskDesc}
								onChange={(e) => setTaskDesc(e.target.value)}
								data-cy="task-description-input"
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							Priority : <br />
							<TextField
								style={{ maxWidth: "100px" }}
								variant="outlined"
								type="number"
								name="priority"
								value={taskPriority}
								data-cy="task-priority-input"
								onChange={(e) => setTaskPriority(e.target.value)}
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							Estimation (h - hours) : *<br />
							<TextField
								required
								style={{ maxWidth: "100px" }}
								variant="outlined"
								type="number"
								name="estimation"
								value={taskEst}
								data-cy="task-estimation-input"
								onChange={(e) => setTaskEst(e.target.value)}
							/>
						</label>
					</div>
					<FormControl
						required
						style={{ margin: "1%", minWidth: "300px" }}
						disabled={!canEdit}
					>
						<InputLabel id="demo-simple-select-label">
							-- Pick Category --
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={pickedCategory}
							label="Category"
							onChange={handleChange}
							data-cy="select-category"
							renderValue={(selected) => (
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
									}}
									onClick={() => navigate("/simulation/category/" + selected)}
								>
									{getCategoryLabel(selected)}
								</div>
							)}
						>
							{categories
								? categories.map((category) => (
										<MenuItem key={category._id} value={category._id}>
											{category.name}
										</MenuItem>
								  ))
								: ""}
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
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/category")}
							data-cy="category-button"
						>
							Create new category
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
									Add Task to Project
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
								navigate(`/simulation`);
								handleCloseModal();
							}}
						>
							Simulation
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => navigateToNewTask()}
							data-cy="edit-task"
						>
							Edit Task
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
