import SearchIcon from "@mui/icons-material/Search";
import {
	alpha,
	Button,
	InputBase,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import React, { useState } from "react";

import { Navigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../../api/userApi";
import { deleteWorker } from "../../../api/workerApi";
import IUser from "../../../interfaces/user";
import TokenUtilService from "../../../utils/token-util";

export default function UserList() {
	const [allUsers, setAllUsers] = React.useState<Array<IUser>>([]);
	const [rows, setRows] = useState<Array<IUser>>([]);

	const getAllExistingUsers = async () => {
		await getAllUsers().then((data) => {
			console.log(data);
			setAllUsers(data);
		});
	};

	function onRemoveUserClick(_id: string | undefined) {
		if (_id) {
			deleteUser(_id).then(() =>
				alert("User removed! Please refresh page to see changes.")
			);
		}
	}

	React.useEffect(() => {
		getAllExistingUsers();
		if (allUsers) {
			setRows(allUsers);
		}
	}, [allUsers.length]);

	return (
		<div>
			<Paper>
				<TableContainer>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>User ID</TableCell>
								<TableCell align="right">Username</TableCell>
								<TableCell align="right">E-mail</TableCell>
								<TableCell align="right"> </TableCell>
								<TableCell align="right"> </TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row._id}>
									<TableCell scope="row">{row._id}</TableCell>
									<TableCell align="right">{row.username}</TableCell>
									<TableCell align="right">{row.email}</TableCell>
									<TableCell
										align="right"
										onClick={() => onRemoveUserClick(row._id)}
									>
										<Button>Remove</Button>
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
