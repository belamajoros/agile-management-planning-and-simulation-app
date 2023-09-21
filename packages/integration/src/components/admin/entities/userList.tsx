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
import UserService from "balaz/UserService";
import { deleteUser } from "marhevsky/UserApi";
import React, { useState } from "react";
import IUser from "../../../types/user.type";

export default function UserList() {
	const [allUsers, setAllUsers] = useState<Array<IUser>>([]);
	const getAllExistingUsers = async () => {
		await UserService.getUsers().then((result: any) => {
			setAllUsers(result.data);
		});
	};

	async function onRemoveUserClick(_id: string | undefined) {
		if (_id) {
			await UserService.deleteUser(_id).then(async () => {
				await deleteUser(_id).then(() => {
					alert("User removed!");
					window.location.reload();
				});
			});
		}
	}

	React.useEffect(() => {
		getAllExistingUsers();
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
							{allUsers.map((row) => (
								<TableRow key={row._id}>
									<TableCell scope="row">{row._id}</TableCell>
									<TableCell align="right">{row.name}</TableCell>
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
