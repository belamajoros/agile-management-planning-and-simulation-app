import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
	Button,
	Card,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import { getProjectByCreatorId, getProjectById } from "../../api/projectApi";
import "../../api/userApi";
import { getUserById } from "../../api/userApi";
import IProject from "../../interfaces/project";
import IUser from "../../interfaces/user";
import { removeUserProject } from "../../services/userService";
import TokenUtilService from "../../utils/token-util";

export const UserPage = () => {
	const [user, setUser] = React.useState<IUser>();
	const [projects, setProjects] = React.useState<Array<string>>([]);
	const [projectsData, setProjectsData] = React.useState<Array<IProject>>([]);

	const loggedUserId = TokenUtilService.getCurrentUserId();

	const getUserData = async () => {
		if (loggedUserId) {
			await getUserById(loggedUserId)
				.then((data) => {
					setUser(data);
					if (data.projects) {
						setProjects(data.projects);
					}
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};
	const getProjectsData = async () => {
		if (projects) {
			let tempProjects: Array<IProject> = [];
			for (const prj of projects) {
				await getProjectById(prj)
					.then((data) => {
						tempProjects.push(data);
					})
					.catch((e) => {
						console.log(e);
					});
			}
			setProjectsData(tempProjects);
		} else {
			console.log("User has no projects assigned.");
		}
		/* if (loggedUserId) {
			await getProjectByCreatorId(loggedUserId)
				.then((data) => {
					setProjectsData(data);
				})
				.catch((e) => {
					console.log(e);
				});
		} */
	};

	useEffect(() => {
		getUserData();
		/* if (projects) {
			getProjectsData();
		} */
		getProjectsData();
	}, [projects.length]);

	function onRemoveProjectClick(_id: string | undefined) {
		if (_id && loggedUserId) {
			removeUserProject(loggedUserId, _id).then(() => {
				alert("Project removed! Please refresh page to see changes.");
			});
		}
	}

	return (
		<div style={{ margin: "5%" }}>
			<div>
				<div style={{ display: "flex" }}>
					<AccountCircleIcon style={{ fontSize: 100, color: "gray" }} />
					<h1 style={{ marginLeft: "3%" }}>{user ? user.username : ""} </h1>
				</div>
				<h2>{user ? user.email : ""}</h2>
			</div>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 100 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>
								<h3>My Projects</h3>
							</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{projectsData ? (
							projectsData.map((project) => (
								<TableRow key={project ? project._id : ""}>
									<TableCell>
										<a href={"/simulation/project/" + project._id}>
											{project.name}
										</a>
									</TableCell>
									<TableCell>
										<Button onClick={() => onRemoveProjectClick(project._id)}>
											Remove
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<div>No projects</div>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};
