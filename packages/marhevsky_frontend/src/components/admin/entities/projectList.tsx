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
import { deleteProject, getAllProjects } from "../../../api/projectApi";
import IProject from "../../../interfaces/project";
import TokenUtilService from "../../../utils/token-util";

export default function ProjectList() {
	const [allProjects, setAllProjects] = React.useState<Array<IProject>>([]);
	const [rows, setRows] = useState<Array<IProject>>([]);

	const getAllExistingProjects = async () => {
		await getAllProjects().then((data) => {
			console.log(data);
			setAllProjects(data);
		});
	};

	function onRemoveProjectClick(_id: string | undefined) {
		if (_id) {
			deleteProject(_id).then(() =>
				alert("Project removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingProjects();
		if (allProjects) {
			setRows(allProjects);
		}
	}, [allProjects.length]);

	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Project ID</TableCell>
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
										<a href={"/simulation/project/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveProjectClick(row._id)}>
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
