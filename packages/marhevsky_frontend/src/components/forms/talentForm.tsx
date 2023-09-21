import { Button, Chip, Modal, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCategories } from "../../api/categoryApi";
import { createTalent, getTalentById, updateTalent } from "../../api/talentApi";
import Talent from "../../classes/talent";
import ICategory from "../../interfaces/category";
import ITalent from "../../interfaces/talent";
import TokenUtilService from "../../utils/token-util";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 10,
	boxShadow: 24,
	p: 4,
};

export default function TalentForm() {
	const [categories, setCategories] = React.useState<Array<ICategory>>([]);
	const [pickedCategory, setPickedCategory] = React.useState<string>("");

	const [talentName, setTalentName] = React.useState<string>("");
	const [talentDesc, setTalentDesc] = React.useState<string>("");
	const [talentBuff, setTalentBuff] = React.useState<string>("");

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseTalentId, setResponseTalentId] = React.useState<string>("");
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

	const navigate = useNavigate();
	const navigateToNewTalent = () => {
		if (responseTalentId != "") {
			const path = `/simulation/talent/` + responseTalentId;
			navigate(path);
			handleCloseModal();
		}
	};

	const getTalent = async () => {
		if (id) {
			const data = await getTalentById(id);
			if (data.name && data.description && data.buff_value && data.category) {
				setTalentName(data.name);
				setTalentDesc(data.description);
				setTalentBuff(data.buff_value.toString());
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

	const handleChange = (event: SelectChangeEvent) => {
		setPickedCategory(event.target.value);
	};

	React.useEffect(() => {
		getUserPrivilege();
		if (id) {
			getTalent();
		}
		getCategories();
	}, []);
	// @ts-ignore
	return (
		<fieldset style={{ border: "none" }} disabled={!canEdit}>
			<div
				style={{
					border: "solid",
					borderRadius: 15,
					borderColor: "lightgray",
					margin: "5%",
				}}
				data-cy="talent-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Talent
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							name: { value: string };
							description: { value: string };
							buff_value: { value: number };
							category: { value: string };
						};
						const name = talentName;
						const description = talentDesc;
						const buff_value: number = +talentBuff;
						const category = pickedCategory;
						const creator = TokenUtilService.getCurrentUserId();

						if (creator) {
							const talent: ITalent = new Talent(
								buff_value,
								category,
								description,
								name,
								creator
							);

							if (!id) {
								createTalent(talent)
									.then((r) => {
										if (r._id) {
											setResponseTalentId(r._id);
											setMessage("Talent created successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not create Talent!");
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
									buff_value: buff_value,
									description: description,
									category: category,
									creator: creator,
								};
								updateTalent(id, data)
									.then((r) => {
										if (r._id) {
											setResponseTalentId(r._id);
											setMessage("Talent updated successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not update Talent!");
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
								value={talentName}
								onChange={(e) => setTalentName(e.target.value)}
								data-cy="talent-name-input"
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
								value={talentDesc}
								onChange={(e) => setTalentDesc(e.target.value)}
								data-cy="talent-description-input"
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							Buff : *<br />
							<TextField
								required
								style={{ maxWidth: "100px" }}
								variant="outlined"
								InputProps={{ inputProps: { min: -100, max: 100 } }}
								type="number"
								name="buff_value"
								value={talentBuff}
								onChange={(e) => setTalentBuff(e.target.value)}
								data-cy="talent-buff-input"
							/>
						</label>
					</div>
					<FormControl
						required
						style={{ minWidth: "300px", margin: "1%" }}
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
				<Modal
					open={openModalSubmit}
					onClose={handleOpenModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					data-cy="success-modal"
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
									navigate(`/simulation`);
									handleCloseModal();
								}}
							>
								Simulation
							</Button>
							<Button
								style={{ display: "block", margin: "auto", height: "50px" }}
								size={"large"}
								variant="contained"
								onClick={() => navigateToNewTalent()}
								data-cy="edit-talent"
							>
								Edit Talent
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
			</div>
		</fieldset>
	);
}
