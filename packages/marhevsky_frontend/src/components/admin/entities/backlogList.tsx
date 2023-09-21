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
import { deleteBacklog, getAllBacklogs } from "../../../api/backlogApi";
import IBacklog from "../../../interfaces/backlog";
import TokenUtilService from "../../../utils/token-util";

export default function BacklogList() {
	const [allBacklogs, setAllBacklogs] = React.useState<Array<IBacklog>>([]);
	const [rows, setRows] = useState<Array<IBacklog>>([]);

	const getAllExistingBacklogs = async () => {
		await getAllBacklogs().then((data) => {
			console.log(data);
			setAllBacklogs(data);
		});
	};
	function onRemoveBacklogClick(_id: string | undefined) {
		if (_id) {
			deleteBacklog(_id).then(() =>
				alert("Backlog removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingBacklogs();
		if (allBacklogs) {
			setRows(allBacklogs);
		}
	}, [allBacklogs.length]);

	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Backlog ID</TableCell>
								<TableCell align="right">Task ID</TableCell>
								<TableCell align="right">Progress</TableCell>
								<TableCell align="right">SprintNo</TableCell>
								<TableCell align="right"> </TableCell>
								<TableCell align="right"> </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row._id}>
									<TableCell scope="row">{row._id}</TableCell>
									<TableCell align="right">{row.task}</TableCell>
									<TableCell align="right">{row.progress}</TableCell>
									<TableCell align="right">{row.sprintNo}</TableCell>
									<TableCell align="right">
										<a href={"/simulation/backlog/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveBacklogClick(row._id)}>
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
