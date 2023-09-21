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
import { deleteWorker, getAllWorkers } from "../../../api/workerApi";
import IWorker from "../../../interfaces/worker";
import TokenUtilService from "../../../utils/token-util";

export default function WorkerList() {
	const [allWorkers, setAllWorkers] = React.useState<Array<IWorker>>([]);
	const [rows, setRows] = useState<Array<IWorker>>([]);

	const getAllExistingWorkers = async () => {
		await getAllWorkers().then((data) => {
			console.log(data);
			setAllWorkers(data);
		});
	};
	function onRemoveWorkerClick(_id: string | undefined) {
		if (_id) {
			deleteWorker(_id).then(() =>
				alert("Worker removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingWorkers();
		if (allWorkers) {
			setRows(allWorkers);
		}
	}, [allWorkers.length]);

	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Worker ID</TableCell>
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
										<a href={"/simulation/worker/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveWorkerClick(row._id)}>
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
