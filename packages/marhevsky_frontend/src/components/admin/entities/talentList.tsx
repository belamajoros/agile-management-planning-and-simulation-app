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
import { deleteTalent, getAllTalents } from "../../../api/talentApi";
import ITalent from "../../../interfaces/talent";
import TokenUtilService from "../../../utils/token-util";

export default function TalentList() {
	const [allTalents, setAllTalents] = React.useState<Array<ITalent>>([]);
	const [rows, setRows] = useState<Array<ITalent>>([]);

	const getAllExistingTalents = async () => {
		await getAllTalents().then((data) => {
			console.log(data);
			setAllTalents(data);
		});
	};
	function onRemoveTalentClick(_id: string | undefined) {
		if (_id) {
			deleteTalent(_id).then(() =>
				alert("Talent removed! Please refresh page to see changes.")
			);
		}
	}
	React.useEffect(() => {
		getAllExistingTalents();
		if (allTalents) {
			setRows(allTalents);
		}
	}, [allTalents.length]);
	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>Talent ID</TableCell>
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
										<a href={"/simulation/talent/" + row._id}>Edit</a>
									</TableCell>
									<TableCell align="right">
										<Button onClick={() => onRemoveTalentClick(row._id)}>
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
