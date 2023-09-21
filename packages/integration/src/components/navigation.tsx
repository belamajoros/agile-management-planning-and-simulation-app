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
import TokenUtilService from "marhevsky/TokenUtil";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const navigation = [
	{ name: "Home", href: "/home", testid: "home-nav-button" },
	{ name: "Simulation", href: "/simulation", testid: "simulation-nav-button" },
	{ name: "Planner", href: "/planner", testid: "planner-nav-button" },
];

const user = [
	{ name: "Profile", href: "/profile", testid: "profile-nav-button" },
	{ name: "Admin Center", href: "/center", testid: "admin-nav-button" },
	{ name: "Logout", href: "/logout", testid: "logout-nav-button" },
];

const host = [
	{ name: "Login", href: "/login", testid: "login-button" },
	{ name: "Register", href: "/register", testid: "register-button" },
];

const Navigation = (props: { isAdmin: boolean }) => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	);
	/* const [isAdmin, setIsAdmin] = useState<boolean>(false); */

	const { isAdmin } = props;
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
						className="text-decoration-none"
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

					<Box
						sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
						data-cy="logo"
					>
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
						{isUserLogged() && (
							<>
								{navigation.map((page) => (
									<Button
										key={page.href}
										onClick={() => handleCloseNavMenu(page.href)}
										sx={{ my: 2, color: "white", display: "block" }}
										data-cy={page.testid}
									>
										{page.name}
									</Button>
								))}
							</>
						)}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open options">
							<IconButton
								onClick={handleOpenUserMenu}
								sx={{ p: 0 }}
								data-cy="user-menu"
							>
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
										return setting.name === "Admin Center" && isAdmin ? (
											<MenuItem
												onClick={() => handleCloseUserMenu(setting.href)}
												data-cy={setting.testid}
												key={setting.href}
											>
												<Typography textAlign="center">
													{setting.name}
												</Typography>
											</MenuItem>
										) : setting.name !== "Admin Center" ? (
											<MenuItem
												onClick={() => handleCloseUserMenu(setting.href)}
												data-cy={setting.testid}
												key={setting.href}
											>
												<Typography textAlign="center">
													{setting.name}
												</Typography>
											</MenuItem>
										) : null;
								  })
								: host.map((page) => (
										<MenuItem
											key={page.href}
											onClick={() => handleCloseNavMenu(page.href)}
											href={page.href}
											data-cy={page.testid}
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

export default Navigation;
