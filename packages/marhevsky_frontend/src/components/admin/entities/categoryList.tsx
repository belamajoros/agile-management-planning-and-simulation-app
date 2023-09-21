import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { deleteCategory, getAllCategories } from "../../../api/categoryApi";
import ICategory from "../../../interfaces/category";
import TokenUtilService from "../../../utils/token-util";

export default function CategoryList() {
	const [allCategories, setAllCategories] = React.useState<Array<ICategory>>(
		[]
	);
	const [rows, setRows] = useState<Array<ICategory>>([]);

	const getAllExistingCategories = async () => {
		await getAllCategories().then((data) => {
			console.log(data);
			setAllCategories(data);
		});
	};
	function onRemoveCategoryClick(_id: string | undefined) {
		if (_id) {
			deleteCategory(_id).then(() =>
				alert("Category removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingCategories();
		if (allCategories) {
			setRows(allCategories);
		}
	}, [allCategories.length]);
	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Category ID</TableCell>
								<TableCell align="right">Name</TableCell>
								<TableCell align="right">Description</TableCell>
								<TableCell align="right"> </TableCell>
								<TableCell align="right"> </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row._id}>
									<TableCell scope="row">{row._id}</TableCell>
									<TableCell align="right">{row.name}</TableCell>
									<TableCell align="right">{row.description}</TableCell>
									<TableCell align="right">
										<a href={"/simulation/category/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveCategoryClick(row._id)}>
											Remove
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}
