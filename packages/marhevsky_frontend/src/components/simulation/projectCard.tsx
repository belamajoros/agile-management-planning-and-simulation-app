import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../api/projectApi";
import { getTaskById } from "../../api/taskApi";
import { getUserById, updateUser } from "../../api/userApi";
import Project from "../../classes/project";
import IProject from "../../interfaces/project";
import ITask from "../../interfaces/task";
import { removeAllBacklogsFromProject } from "../../services/projectService";
import { addUserProject, removeUserProject } from "../../services/userService";
import TokenUtilService from "../../utils/token-util";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 10,
	boxShadow: 24,
	p: 4,
};

export const ProjectCard = (project: IProject) => {
	const [tasks, setTasks] = React.useState<Array<ITask>>([]);

	const [openModalCopyProject, setOpenModalCopyProject] = React.useState(false);
	const handleOpenModalCopyProject = () => setOpenModalCopyProject(true);
	const handleCloseModalCopyProject = () => setOpenModalCopyProject(false);

	const [openModalDeleteProject, setOpenModalDeleteProject] =
		React.useState(false);
	const handleOpenModalDeleteProject = () => setOpenModalDeleteProject(true);
	const handleCloseModalDeleteProject = () => setOpenModalDeleteProject(false);

	const localUserId = TokenUtilService.getCurrentUserId();
	let navigate = useNavigate();

	const openProjectDetails = (id: string | undefined) => {
		if (id != undefined) {
			let path = `/simulation/project/` + id;
			navigate(path);
		}
	};
	const createCopyForMyProjects = () => {
		if (localUserId) {
			const newProjectCopy: IProject = new Project(
				[],
				localUserId,
				project.description,
				project.name + " copy",
				project.tasks,
				project.team,
				false
			);
			createProject(newProjectCopy).then((data) => {
				if (data._id) {
					addUserProject(localUserId, data._id).then(() => {
						handleCloseModalCopyProject();
						navigate(`/simulation/simulate`);
						window.location.reload();
					});
				}
			});
		}
	};

	async function getTask() {
		if (project.tasks) {
			let temp: Array<ITask> = [];
			for (const task of project.tasks) {
				await getTaskById(task)
					.then((data) => {
						temp.push(data);
					})
					.catch((e) => {
						console.log(e);
					});
			}
			setTasks(temp);
		} else {
			console.log("no tasks assigned to this project !");
		}
		console.log(tasks);
	}
	const openProject = () => {
		if (localUserId && project.template === true) {
			handleOpenModalCopyProject();
		} else {
			removeAllBacklogsFromProject(project._id!);
			let path = `/simulate/sprint`;
			navigate(path, { state: project });
		}
	};

	React.useEffect(() => {
		getTask();
	}, []);

	function timeout(delay: number) {
		return new Promise((res) => setTimeout(res, delay));
	}

	const removeProject = (_id: string | undefined) => {
		if (_id && localUserId) {
			removeUserProject(localUserId, _id);
		}
	};

	const MAX_LENGTH = 21;

	return (
		<div className="ml-2 mt-2">
			<Card sx={{ minWidth: 275 }} key={project._id} data-cy="project-card">
				<CardContent onClick={openProject} data-cy="proj-click">
					<Typography
						sx={{ fontSize: 14 }}
						color="text.secondary"
						gutterBottom
						data-cy="proj-id"
					>
						{project._id}
					</Typography>
					<Typography variant="h5" component="div">
						{project.name}
						{/* {project.name && project.name.length > MAX_LENGTH ? (
							<>{`${project.name.substr(0, MAX_LENGTH)}...`}</>
						) : (
							<>{project.name}</>
						)} */}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						{project.description}
						{/* {project.description &&
						project.description.length > MAX_LENGTH + 10 ? (
							<>{`${project.description.substr(0, MAX_LENGTH + 12)}...`}</>
						) : (
							<>{project.description}</>
						)} */}
					</Typography>
					{/* {tasks ? (
						tasks.map((task) => (
							<Typography variant="body2" key={task._id}>
								{task.description && task.description.length > MAX_LENGTH ? (
									<>{`${task.description.substr(0, MAX_LENGTH)}...`}</>
								) : (
									<>{task.description}</>
								)}
							</Typography>
						))
					) : (
						<div>No tasks found!</div>
					)} */}
				</CardContent>
				<CardActions className="align-items-center d-flex">
					<Button
						className="mr-auto p-2"
						size="small"
						onClick={() => openProjectDetails(project._id)}
						data-cy="open-details"
					>
						Open Project Details
					</Button>
					{project.template === false ? (
						<DeleteOutlinedIcon
							color="error"
							onClick={() => handleOpenModalDeleteProject()}
							data-cy="trash-icon"
						/>
					) : null}
				</CardActions>
			</Card>
			<Modal
				open={openModalCopyProject}
				onClose={handleOpenModalCopyProject}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				data-cy="copy-proj-modal"
			>
				<Box sx={style}>
					<Typography
						style={{ margin: "3%", textAlign: "center" }}
						id="modal-modal-title"
						variant="h5"
						component="h2"
					>
						Do you want to copy this project into My projects?
					</Typography>
					<div style={{ display: "flex", marginTop: "5%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={createCopyForMyProjects}
							data-cy="add-button"
						>
							Add to My Projects
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={handleCloseModalCopyProject}
						>
							Close
						</Button>
					</div>
				</Box>
			</Modal>
			<Modal
				open={openModalDeleteProject}
				onClose={handleOpenModalDeleteProject}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				data-cy="delete-project-modal"
			>
				<Box sx={style}>
					<Typography
						style={{ margin: "3%", textAlign: "center" }}
						id="modal-modal-title"
						variant="h5"
						component="h2"
					>
						Are you sure you want to delete this project from 'My projects'?
					</Typography>
					<div style={{ display: "flex", marginTop: "5%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={() => removeProject(project._id)}
							data-cy="yes-delete"
						>
							Yes
						</Button>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={handleCloseModalDeleteProject}
						>
							No
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
