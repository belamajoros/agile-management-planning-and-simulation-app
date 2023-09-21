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
import { deleteTask, getAllTasks } from "../../../api/taskApi";
import ITask from "../../../interfaces/task";
import TokenUtilService from "../../../utils/token-util";

export default function TaskList() {
	const [allTasks, setAllTasks] = React.useState<Array<ITask>>([]);
	const [rows, setRows] = useState<Array<ITask>>([]);

	const getAllExistingTasks = async () => {
		await getAllTasks().then((data) => {
			console.log(data);
			setAllTasks(data);
		});
	};
	function onRemoveTaskClick(_id: string | undefined) {
		if (_id) {
			deleteTask(_id).then(() =>
				alert("Task removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingTasks();
		if (allTasks) {
			setRows(allTasks);
		}
	}, [allTasks.length]);
	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Task ID</TableCell>
								<TableCell align="right">Title</TableCell>
								<TableCell align="right">Description</TableCell>
								<TableCell align="right"> </TableCell>
								<TableCell align="right"> </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row._id}>
									<TableCell scope="row">{row._id}</TableCell>
									<TableCell align="right">{row.title}</TableCell>
									<TableCell align="right">{row.description}</TableCell>
									<TableCell align="right">
										<a href={"/simulation/task/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveTaskClick(row._id)}>
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
