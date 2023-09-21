import React from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import "../../api/userApi";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { IconButton, InputAdornment, Modal } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import TokenUtilService from "../../utils/token-util";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: 10,
	boxShadow: 24,
	p: 4,
};

export default function Login() {
	const [errorMessage, setErrorMessage] = React.useState<string>("");
	const [openSuccess, setOpenSuccess] = React.useState(false);
	const [openDenied, setOpenDenied] = React.useState(false);
	const handleOpenSuccessModal = () => setOpenSuccess(true);
	const handleOpenDeniedModal = () => setOpenDenied(true);
	const handleCloseSuccessModal = () => setOpenSuccess(false);
	const handleCloseDeniedModal = () => setOpenDenied(false);

	const [values, setValues] = React.useState({
		showPassword: false,
	});

	let navigate = useNavigate();
	const navigateToPage = (path: string) => {
		navigate(path);
	};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};
	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			email: { value: string };
			password: { value: string };
		};
		const email = target.email.value; // typechecks!
		const password = target.password.value; // typechecks!

		await loginUser(email, password)
			.then((res) => {
				console.log(res.message);
				if (res.token) {
					TokenUtilService.storeTokenToStorage(res.token);
					handleOpenSuccessModal();
				} else {
					console.log(res.message);
					setErrorMessage(res.message);
					handleOpenDeniedModal();
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const theme = createTheme();

	return (
		<div>
			<ThemeProvider theme={theme}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography
							component="h1"
							variant="h5"
						>
							Log-in Form
						</Typography>
						<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type={values.showPassword ? "text" : "password"}
								id="password"
								autoComplete="current-password"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{values.showPassword ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Login
							</Button>
							<Grid container>
								<Grid item>
									<Link href="/register" variant="body2">
										{"Don't have an account? Register"}
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
			<Modal
				open={openSuccess}
				onClose={handleCloseSuccessModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						style={{ margin: "3%", textAlign: "center" }}
						id="modal-modal-title"
						variant="h5"
						component="h2"
					>
						You have been successfully logged in!
					</Typography>
					<div style={{ display: "flex", margin: "5%" }}>
						<Button
							style={{ marginRight: "1%" }}
							size={"large"}
							variant="contained"
							onClick={() => navigateToPage(`/`)}
						>
							Home
						</Button>
						<Button
							style={{ marginRight: "1%" }}
							size={"large"}
							variant="contained"
							onClick={() => navigateToPage(`/simulation/simulate`)}
						>
							Simulation
						</Button>
						<Button
							size={"large"}
							variant="contained"
							onClick={() => navigateToPage(`/profile`)}
						>
							Profile
						</Button>
					</div>
				</Box>
			</Modal>
			<Modal
				open={openDenied}
				onClose={handleOpenDeniedModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						style={{ margin: "3%", textAlign: "center" }}
						id="modal-modal-title"
						variant="h5"
						component="h2"
					>
						{errorMessage}
					</Typography>
					<div style={{ display: "flex", marginTop: "5%" }}>
						<Button
							style={{ display: "block", margin: "auto" }}
							size={"large"}
							variant="contained"
							onClick={handleCloseDeniedModal}
						>
							Close
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
}
