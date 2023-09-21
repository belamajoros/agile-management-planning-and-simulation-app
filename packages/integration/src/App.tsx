import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import UserService from "balaz/UserService";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithId } from "marhevsky/AuthApi";
import { signJWT } from "marhevsky/jwtApi";
import PrivateRoute from "marhevsky/PrivateRoute";
import TokenUtilService from "marhevsky/TokenUtil";
import { getUserById } from "marhevsky/UserApi";
import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import AdminCenter from "./components/admin/adminCenter";
import UserList from "./components/admin/entities/userList";
import AdminRoute from "./components/AdminRoute";
import Navigation from "./components/navigation";
import Home from "./components/screens/home";
import JWTResponse from "./types/jwt.type";
import IUser from "./types/user.type";
const Login = React.lazy(() => import("balaz/Login"));
const Register = React.lazy(() => import("balaz/Register"));
const PlannerBacklog = React.lazy(() => import("balaz/Backlog"));
const Category = React.lazy(() => import("marhevsky/Category"));
const Task = React.lazy(() => import("marhevsky/Task"));
const Worker = React.lazy(() => import("marhevsky/Worker"));
const Talent = React.lazy(() => import("marhevsky/Talent"));
const Backlog = React.lazy(() => import("marhevsky/Backlog"));
const Project = React.lazy(() => import("marhevsky/Project"));
const ProjectSimulationReview = React.lazy(
	() => import("marhevsky/ProjectSimulationReview")
);
const AssignTasks = React.lazy(() => import("marhevsky/AssignTasks"));
const Profile = React.lazy(() => import("balaz/Profile"));
const ProjectOverview = React.lazy(() => import("marhevsky/ProjectOverview"));
const DragList = React.lazy(() => import("marhevsky/DragList"));
const Planner = React.lazy(() => import("balaz/Home"));
const SimulationBoard = React.lazy(() => import("marhevsky/Home"));
const ProjectScreen = React.lazy(() => import("balaz/Project"));
const Logout = React.lazy(() => import("marhevsky/Logout"));
const BacklogList = React.lazy(() => import("marhevsky/BacklogList"));
const CategoryList = React.lazy(() => import("marhevsky/CategoryList"));
const ProjectList = React.lazy(() => import("marhevsky/ProjectList"));
const TalentList = React.lazy(() => import("marhevsky/TalentList"));
const TaskList = React.lazy(() => import("marhevsky/TaskList"));
const WorkerList = React.lazy(() => import("marhevsky/WorkerList"));
const ProjectListPlanner = React.lazy(() => import("balaz/ProjectList"));

function App() {
	const [user, setUser] = useState({ userId: "", email: "" });
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	window.addEventListener("user", async () => {
		const data = localStorage.getItem("user");
		if (data) {
			const user = JSON.parse(data);
			setUser({ userId: user.user._id, email: user.user.email });
		}
	});
	const navigate = useNavigate();

	const create = async () => {
		await createUserWithId(user.userId, user.email);
	};

	const getUser = async () => {
		await getUserById(user.userId)
			.then(async (userData: IUser) => {
				if ("message" in userData) {
					create();
				} else {
					console.log("User exists.");
				}
				await UserService.getUser(user.userId).then((response: any) => {
					setIsAdmin(response.data.roles.includes("admin"));
				});
				navigate("/home");
			})
			.catch((err: string) => {
				console.log(err);
			});
	};

	useEffect(() => {
		if (localStorage.getItem("user")) {
			const data = localStorage.getItem("user");
			if (data) {
				const user = JSON.parse(data);
				const checkIsAdmin = async () => {
					try {
						const response = await UserService.getUser(user.user._id);
						setIsAdmin(response.data.roles.includes("admin"));
					} catch (error) {
						console.error("Error fetching user:", error);
					}
				};
				checkIsAdmin();
			}
		}
	}, []);

	useEffect(() => {
		const jwt = async () => {
			await signJWT(user.userId)
				.then((res: JWTResponse) => {
					TokenUtilService.storeTokenToStorage(res.token);
					getUser();
				})
				.catch((res: JWTResponse) => {
					console.log(res.error);
				});
		};
		if (user.userId.length > 0) {
			jwt();
		}
	}, [user]);

	return (
		<Suspense
			fallback={
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
					}}
				>
					<CircularProgress />
				</Box>
			}
		>
			<Navigation isAdmin={isAdmin} />
			<div className="container mt-3">
				<Routes>
					<Route
						path="/home"
						element={
							<PrivateRoute>
								{" "}
								<Home />{" "}
							</PrivateRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route
						path="/planner"
						element={
							<PrivateRoute>
								<Planner />
							</PrivateRoute>
						}
					/>
					<Route
						path="/planner/:id"
						element={
							<PrivateRoute>
								{" "}
								<ProjectScreen />{" "}
							</PrivateRoute>
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route
						path="/simulation"
						element={
							<PrivateRoute>
								<SimulationBoard />
							</PrivateRoute>
						}
					/>
					<Route
						path="/backlog"
						element={
							<PrivateRoute>
								<PlannerBacklog />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/simulate"
						element={
							<PrivateRoute>
								<ProjectOverview />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/category"
						element={
							<PrivateRoute>
								<Category />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/talent"
						element={
							<PrivateRoute>
								<Talent />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/worker"
						element={
							<PrivateRoute>
								<Worker />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/task"
						element={
							<PrivateRoute>
								<Task />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/backlog"
						element={
							<PrivateRoute>
								<Backlog />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/project"
						element={
							<PrivateRoute>
								<Project />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/category/:id"
						element={
							<PrivateRoute>
								{" "}
								<Category />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/talent/:id"
						element={
							<PrivateRoute>
								{" "}
								<Talent />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/worker/:id"
						element={
							<PrivateRoute>
								{" "}
								<Worker />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/backlog/:id"
						element={
							<PrivateRoute>
								{" "}
								<Backlog />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/project/:id"
						element={
							<PrivateRoute>
								{" "}
								<Project />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulation/task/:id"
						element={
							<PrivateRoute>
								{" "}
								<Task />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulate/sprint"
						element={
							<PrivateRoute>
								{" "}
								<DragList />
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulate/backlog"
						element={
							<PrivateRoute>
								{" "}
								<AssignTasks />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/simulate/reviewProject"
						element={
							<PrivateRoute>
								{" "}
								<ProjectSimulationReview />{" "}
							</PrivateRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route
						path="/center"
						element={
							<PrivateRoute>
								<AdminRoute>
									<AdminCenter />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/user"
						element={
							<PrivateRoute>
								<AdminRoute>
									<UserList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/project"
						element={
							<PrivateRoute>
								<AdminRoute>
									<ProjectList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/backlog"
						element={
							<PrivateRoute>
								<AdminRoute>
									<BacklogList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/task"
						element={
							<PrivateRoute>
								<AdminRoute>
									<TaskList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/projects"
						element={
							<PrivateRoute>
								<AdminRoute>
									<ProjectListPlanner />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/worker"
						element={
							<PrivateRoute>
								<AdminRoute>
									<WorkerList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/talent"
						element={
							<PrivateRoute>
								<AdminRoute>
									<TalentList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route
						path="/center/category"
						element={
							<PrivateRoute>
								<AdminRoute>
									<CategoryList />
								</AdminRoute>
							</PrivateRoute>
						}
					/>
					<Route path="/logout" element={<Logout />} />
					<Route path="/" element={<Navigate to="/home" replace />} />
				</Routes>
			</div>
		</Suspense>
	);
}

export default App;
