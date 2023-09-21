import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TokenUtilService from "../utils/token-util";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Simulation", href: "/simulation/simulate" },
	{ name: "About", href: "/about" },
];

const user = [
	{ name: "Profile", href: "/profile" },
	{ name: "Center", href: "/center" },
	{ name: "Logout", href: "/logout" },
];

const host = [
	{ name: "Login", href: "/login" },
	{ name: "Register", href: "/register" },
];

export default class Navigation extends Component {
	render() {
		return <ResponsiveAppBar />;
	}
}

const ResponsiveAppBar = () => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);

	let navigate = useNavigate();

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: any) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = (pageLink: string) => {
		setAnchorElNav(null);
		navigate(pageLink);
	};

	const handleCloseUserMenu = (pageLink: string) => {
		setAnchorElUser(null);
		navigate(pageLink);
	};

	let isUserLogged = () => {
		return TokenUtilService.getCurrentUserId() != null;
	};

	useEffect(() => {
		isUserLogged();
	}, [isUserLogged]);
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<HdrAutoIcon
						fontSize="large"
						sx={{ display: { xs: "none", md: "flex" }, mr: 0 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						GILE
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							{navigation.map((page) => (
								<MenuItem
									key={page.href}
									onClick={() => handleCloseNavMenu(page.href)}
									href={page.href}
								>
									<Typography textAlign="center">{page.name}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<HdrAutoIcon
						fontSize="large"
						sx={{ display: { xs: "flex", md: "none" }, mr: 0 }}
					/>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						GILE
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{navigation.map((page) => (
							<Button
								key={page.href}
								onClick={() => handleCloseNavMenu(page.href)}
								sx={{ my: 2, color: "white", display: "block" }}
							>
								{page.name}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open options">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<AccountCircleIcon fontSize="large" sx={{ color: "white" }} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{isUserLogged()
								? user.map((setting) => {
										if (
											setting.name == "Center" &&
											!TokenUtilService.isAdmin()
										) {
											//do nothing
										} else {
											return (
												<MenuItem
													key={setting.href}
													onClick={() => handleCloseUserMenu(setting.href)}
												>
													<Typography textAlign="center">
														{setting.name}
													</Typography>
												</MenuItem>
											);
										}
								  })
								: host.map((page) => (
										<MenuItem
											key={page.href}
											onClick={() => handleCloseNavMenu(page.href)}
											href={page.href}
										>
											<Typography textAlign="center">{page.name}</Typography>
										</MenuItem>
								  ))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
