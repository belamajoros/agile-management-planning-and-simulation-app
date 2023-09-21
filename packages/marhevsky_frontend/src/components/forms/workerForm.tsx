import React from "react";
import { getAllTalents } from "../../api/talentApi";
import ITalent from "../../interfaces/talent";

import { Box, Button, Chip, Modal, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectByCreatorId } from "../../api/projectApi";
import { createWorker, getWorkerById, updateWorker } from "../../api/workerApi";
import Worker from "../../classes/worker";
import IProject from "../../interfaces/project";
import IWorker from "../../interfaces/worker";
import {
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

export default function WorkerForm() {
	const [talents, setTalents] = React.useState<Array<ITalent>>([]);
	const [pickedTalents, setPickedTalents] = React.useState<string[]>([]);

	const [workerName, setWorkerName] = React.useState<string>("");
	const [workerDesc, setWorkerDesc] = React.useState<string>("");

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseWorkerId, setResponseWorkerId] = React.useState<string>("");
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
	const navigateToNewWorker = () => {
		if (responseWorkerId != "") {
			const path = `/simulation/worker/` + responseWorkerId;
			navigate(path);
			handleCloseModal();
		}
	};

	const addToPickedProject = () => {
		setIsProjectPickVisible(true);
		handleCloseModal();
		const temp: Array<string> = [];
		if (pickedProject && responseWorkerId) {
			temp.push(responseWorkerId);
			addWorkersToProject(pickedProject, temp).then((r) => {
				if (r === "ALREADY_EXIST") {
					setMessage("Worker already assigned to this Project!");
					handleOpenModal();
				} else if (r === "") {
					setMessage("Could not add Worker to this Project!");
					handleOpenModal();
				} else {
					navigate(`/simulation/project/` + pickedProject);
				}
			});
		} else {
			if (responseWorkerId) {
				setMessage("Please pick a Project!");
				handleOpenModal();
			}
		}
	};

	const getWorker = async () => {
		if (id) {
			const data = await getWorkerById(id);
			if (data.name && data.description && data.talents) {
				setWorkerName(data.name);
				setWorkerDesc(data.description);
				setPickedTalents(data.talents);
				if (localUserId && data.creator) {
					if (data.creator === localUserId) {
						setCanEdit(true);
					}
				}
			}
		}
	};

	const getTalents = async () => {
		await getAllTalents()
			.then((data) => {
				let temp: Array<ITalent> = [];
				data.forEach((val) => {
					temp.push(val);
				});
				setTalents(temp);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleChange = (event: SelectChangeEvent<typeof pickedTalents>) => {
		let isCategoryDuplicate: boolean = false;
		const {
			target: { value },
		} = event;

		let newRecordCategory: string = "";

		talents.forEach((val) => {
			if (val._id == value[value.length - 1]) {
				newRecordCategory = val.category!;
			}
		});
		console.log(newRecordCategory);
		for (let index of value) {
			talents.forEach((val) => {
				if (val._id == index && index != value[value.length - 1]) {
					if (val.category == newRecordCategory) {
						isCategoryDuplicate = true;
						alert("You can assign only one talent of the same category!");
						return;
					}
				}
			});
		}
		if (value && !isCategoryDuplicate)
			setPickedTalents(typeof value === "string" ? value.split(",") : value);
	};
	const handleProjectChange = (event: SelectChangeEvent) => {
		setPickedProject(event.target.value);
	};

	function getLabel(id: string) {
		for (let i = 0; i < talents.length; i++) {
			if (talents[i]._id === id) {
				return talents[i].name;
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
		getTalents();
		if (id) {
			getWorker();
		}
		if (localUserId) {
			getCurrentUserProjects();
		}
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
				data-cy="worker-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Worker
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							name: { value: string };
							description: { value: string };
							talents: { value: Array<string> };
						};
						const name = workerName;
						const description = workerDesc;
						const selectedTalents = pickedTalents;
						const creator = TokenUtilService.getCurrentUserId();

						if (creator) {
							const worker: IWorker = new Worker(
								description,
								name,
								selectedTalents,
								creator
							);

							if (!id) {
								createWorker(worker)
									.then((r) => {
										if (r._id) {
											setResponseWorkerId(r._id);
											setMessage("Worker created successfully!");
											setIsProjectPickVisible(true);
											handleOpenModal();
										} else {
											setMessage("Could not create Worker!");
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
									name: name,
									description: description,
									talents: selectedTalents,
									creator: creator,
								};
								updateWorker(id, data)
									.then((r) => {
										if (r._id) {
											setResponseWorkerId(r._id);
											setMessage("Worker updated successfully!");
											setIsProjectPickVisible(true);
											handleOpenModal();
										} else {
											setMessage("Could not update Worker!");
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
							Name : *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="name"
								value={workerName}
								onChange={(e) => setWorkerName(e.target.value)}
								data-cy="worker-name-input"
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
								value={workerDesc}
								onChange={(e) => setWorkerDesc(e.target.value)}
								data-cy="worker-description-input"
							/>
						</label>
					</div>
					<FormControl
						required
						style={{ margin: "1%" }}
						sx={{ m: 1, width: 500 }}
						disabled={!canEdit}
					>
						<InputLabel id="demo-multiple-checkbox-label">Talents</InputLabel>
						<Select
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple
							value={pickedTalents}
							onChange={handleChange}
							input={<OutlinedInput label="Talents" />}
							data-cy="select-category"
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip
											key={value}
											clickable={true}
											onMouseDown={(e) => {
												e.stopPropagation();
											}}
											onClick={() => navigate("/simulation/talent/" + value)}
											label={getLabel(value)}
										/>
									))}
								</Box>
							)}
							MenuProps={MenuProps}
						>
							{talents.map((name) => (
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
							size={"large"}
							variant="contained"
							onClick={() => navigate("/simulation/talent")}
							data-cy="talent-button"
						>
							Create new Talent
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
									Add Worker to Project
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
							onClick={() => navigateToNewWorker()}
							data-cy="edit-worker"
						>
							Edit Worker
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
