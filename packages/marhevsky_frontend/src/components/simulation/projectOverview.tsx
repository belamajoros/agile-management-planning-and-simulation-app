import { Button, Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, getProjectByCreatorId } from "../../api/projectApi";
import { getTaskById } from "../../api/taskApi";
import IProject from "../../interfaces/project";
import { getUserProjects } from "../../services/userService";
import TokenUtilService from "../../utils/token-util";
import { ProjectCard } from "./projectCard";

function ProjectOverview() {
	const [myProjects, setMyProjects] = React.useState<Array<IProject>>([]);
	const [templateProjects, setTemplateProjects] = React.useState<
		Array<IProject>
	>([]);
	const [invitedProjects, setInvitedProjects] = React.useState<Array<IProject>>(
		[]
	);

	const currentUserId = TokenUtilService.getCurrentUserId();

	const getMyProjects = () => {
		if (currentUserId) {
			getUserProjects(currentUserId).then((data) => {
				setMyProjects(data);
			});
		}
	};
	const getTemplateAndInvitedProjects = async () => {
		let tempProjects: Array<IProject> = [];
		let invitedProjects: Array<IProject> = [];
		await getAllProjects().then((data) => {
			console.log(data);
			if (data)
				data.forEach((proj) => {
					if (proj.template) {
						tempProjects.push(proj);
					}
					if (
						proj.collaborators &&
						proj.collaborators.length > 0 &&
						currentUserId &&
						proj.collaborators.includes(currentUserId)
					) {
						invitedProjects.push(proj);
					}
				});
		});
		setTemplateProjects(tempProjects);
		setInvitedProjects(invitedProjects);
	};

	let navigate = useNavigate();
	const createNewProject = () => {
		let path = `/simulation/project`;
		navigate(path);
	};

	React.useEffect(() => {
		getMyProjects();
		getTemplateAndInvitedProjects();
	}, [myProjects.length]);

	return (
		<div
			style={{
				border: "solid",
				borderRadius: 15,
				borderColor: "lightgray",
				margin: "5%",
			}}
		>
			<h1 style={{ margin: "3%", textAlign: "center" }}>
				Choose a project you want to simulate{" "}
			</h1>
			<div style={{ margin: "5%" }}>
				<h2>My Projects</h2>
				<Grid container spacing={1} className="mt-2">
					{myProjects && myProjects.length > 0 ? (
						myProjects.map((project) => (
							<ProjectCard
								name={project.name}
								description={project.description}
								tasks={project.tasks}
								creator={project.creator}
								backlogs={project.backlogs}
								team={project.team}
								_id={project._id}
								template={project.template}
								collaborators={project.collaborators}
								key={project._id}
							/>
						))
					) : (
						<p
							style={{ marginLeft: "8px", marginTop: "8px" }}
							data-cy="no-projects"
						>
							You have not created any projects
						</p>
					)}
				</Grid>
			</div>
			<div style={{ margin: "5%" }}>
				<h2>Template projects</h2>
				<Grid container spacing={1} className="mt-2">
					{templateProjects && templateProjects.length > 0 ? (
						templateProjects.map((project) => (
							<ProjectCard
								name={project.name}
								description={project.description}
								tasks={project.tasks}
								creator={project.creator}
								backlogs={project.backlogs}
								team={project.team}
								_id={project._id}
								template={project.template}
								collaborators={project.collaborators}
								key={project._id}
							/>
						))
					) : (
						<p
							style={{ marginLeft: "8px", marginTop: "8px" }}
							data-cy="no-template"
						>
							No template projects found
						</p>
					)}
				</Grid>
			</div>
			<div style={{ margin: "5%" }}>
				<h2>Invited projects</h2>
				<Grid container spacing={1} className="mt-2">
					{invitedProjects && invitedProjects.length > 0 ? (
						invitedProjects.map((project) => (
							<ProjectCard
								name={project.name}
								description={project.description}
								tasks={project.tasks}
								creator={project.creator}
								backlogs={project.backlogs}
								team={project.team}
								_id={project._id}
								template={project.template}
								collaborators={project.collaborators}
								key={project._id}
							/>
						))
					) : (
						<p
							style={{ marginLeft: "8px", marginTop: "8px" }}
							data-cy="no-invited"
						>
							You have not been invited to any projects
						</p>
					)}
				</Grid>
			</div>
			<div style={{ margin: "3%", display: "flex" }}>
				<Button
					style={{ marginLeft: "auto" }}
					size={"large"}
					variant="contained"
					name="project"
					onClick={() => createNewProject()}
				>
					Create new project
				</Button>
			</div>
		</div>
	);
}

export default ProjectOverview;
