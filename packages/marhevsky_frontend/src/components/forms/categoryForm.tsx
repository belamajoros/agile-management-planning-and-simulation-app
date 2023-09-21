import { Button, Modal, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	createCategory,
	getCategoryById,
	updateCategory,
} from "../../api/categoryApi";
import Category from "../../classes/category";
import ICategory from "../../interfaces/category";
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

export default function CategoryForm() {
	const [category, setCategory] = React.useState<ICategory>();
	const [categoryName, setCategoryName] = React.useState<string>("");
	const [categoryDesc, setCategoryDesc] = React.useState<string>("");

	const [message, setMessage] = React.useState<string>("");
	const [openModalSubmit, setOpenModalSubmit] = React.useState(false);
	const handleOpenModal = () => setOpenModalSubmit(true);
	const handleCloseModal = () => setOpenModalSubmit(false);

	const [responseCategoryId, setResponseCategoryId] =
		React.useState<string>("");
	const [canEdit, setCanEdit] = React.useState<boolean>(false);

	const { id } = useParams();
	const localUserId = TokenUtilService.getCurrentUserId();

	const getUserPrivilege = async () => {
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
	const navigateToNewCategory = () => {
		if (responseCategoryId != "") {
			const path = `/simulation/category/` + responseCategoryId;
			navigate(path);
			handleCloseModal();
		}
	};

	const getCategory = async () => {
		if (id) {
			const data = await getCategoryById(id);
			if (data.name && data.description) {
				setCategory(data);
				setCategoryName(data.name);
				setCategoryDesc(data.description);

				if (localUserId && data.creator) {
					if (data.creator === localUserId) {
						setCanEdit(true);
					}
				}
			}
		}
	};
	React.useEffect(() => {
		getUserPrivilege();
		getCategory();
	}, [id]);
	return (
		<fieldset style={{ border: "none" }} disabled={!canEdit}>
			<div
				style={{
					border: "solid",
					borderRadius: 15,
					borderColor: "lightgray",
					margin: "5%",
				}}
				data-cy="category-creation-component"
			>
				<h2
					style={{ marginTop: "3%", textAlign: "center" }}
					data-cy="entity-creator-name"
				>
					Category
				</h2>
				<form
					style={{ margin: "2%" }}
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							name: { value: string };
							description: { value: string };
						};
						const name = target.name.value;
						const description = target.description.value;
						const creator = localUserId;

						if (creator) {
							const newCategory: ICategory = new Category(
								categoryDesc,
								categoryName,
								creator
							);
							if (!id) {
								createCategory(newCategory)
									.then((r) => {
										if (r._id) {
											setResponseCategoryId(r._id);
											setMessage("Category created successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not create Category!");
											handleOpenModal();
										}
									})
									.catch((err) => {
										console.log(err);
									});
							} else {
								const data = {
									name: name,
									description: description,
								};
								updateCategory(id, data)
									.then((r) => {
										if (r._id) {
											setResponseCategoryId(r._id);
											setMessage("Category updated successfully!");
											handleOpenModal();
										} else {
											setMessage("Could not update Category!");
											handleOpenModal();
										}
									})
									.catch((err) => {
										console.log(err);
									});
							}
						}
					}}
				>
					<div style={{ margin: "1%" }}>
						<label>
							Name: *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="name"
								value={categoryName}
								data-cy="category-name-input"
								onChange={(e) => setCategoryName(e.target.value)}
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<label>
							Description: *<br />
							<TextField
								required
								fullWidth
								variant="outlined"
								type="text"
								name="description"
								value={categoryDesc}
								data-cy="category-description-input"
								onChange={(e) => setCategoryDesc(e.target.value)}
							/>
						</label>
					</div>
					<div style={{ margin: "1%" }}>
						<Button
							size={"large"}
							variant="contained"
							type="submit"
							value="Submit"
							data-cy="submit-button"
						>
							Submit
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
							onClick={() => navigateToNewCategory()}
							data-cy="edit-category"
						>
							Edit Category
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
