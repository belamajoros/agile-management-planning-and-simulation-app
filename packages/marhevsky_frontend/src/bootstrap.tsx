import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import AboutPage from "./components/about";
import AdminCenter from "./components/admin/adminCenter";
import BacklogList from "./components/admin/entities/backlogList";
import CategoryList from "./components/admin/entities/categoryList";
import ProjectList from "./components/admin/entities/projectList";
import TalentList from "./components/admin/entities/talentList";
import TaskList from "./components/admin/entities/taskList";
import UserList from "./components/admin/entities/userList";
import WorkerList from "./components/admin/entities/workerList";
import BacklogForm from "./components/forms/backlogForm";
import CategoryForm from "./components/forms/categoryForm";
import ProjectForm from "./components/forms/projectForm";
import TalentForm from "./components/forms/talentForm";
import TaskForm from "./components/forms/taskForm";
import WorkerForm from "./components/forms/workerForm";
import Home from "./components/home";
import Navigation from "./components/navigation";
import Login from "./components/profile/login";
import Logout from "./components/profile/logout";
import PrivateRoute from "./components/profile/PrivateRoute";
import Register from "./components/profile/register";
import { UserPage } from "./components/profile/userPage";
import AssignTasks from "./components/simulation/assignTasks";
import DragList from "./components/simulation/DnDComponents/DragList";
import DragListWrapper from "./components/simulation/DnDComponents/DragListWrapper";
import ProjectOverview from "./components/simulation/projectOverview";
import ProjectSimulationReview from "./components/simulation/projectSimulationReview";
import SimulationSprintReview from "./components/simulation/simulationSprintReview";
import { SocketContext } from "./context/socket";
import reportWebVitals from "./reportWebVitals";
import "./style/index.css";

const socket = io("http://localhost:3333");
const rootElement = document.getElementById("root");

ReactDOM.render(
	<SocketContext.Provider value={socket}>
		<BrowserRouter>
			<Navigation />
			<Routes>
				<Route
					path="/"
					element={
						<PrivateRoute>
							{" "}
							<Home />{" "}
						</PrivateRoute>
					}
				/>
				<Route path="/about" element={<AboutPage />} />

				{/*
                  Auth paths
              */}
				<Route
					path="/profile"
					element={
						<PrivateRoute>
							{" "}
							<UserPage />{" "}
						</PrivateRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/register" element={<Register />} />

				{/*
                  Form paths
              */}
				<Route
					path="/simulation/category"
					element={
						<PrivateRoute>
							{" "}
							<CategoryForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/talent"
					element={
						<PrivateRoute>
							{" "}
							<TalentForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/worker"
					element={
						<PrivateRoute>
							{" "}
							<WorkerForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/backlog"
					element={
						<PrivateRoute>
							{" "}
							<BacklogForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/project"
					element={
						<PrivateRoute>
							{" "}
							<ProjectForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/task"
					element={
						<PrivateRoute>
							{" "}
							<TaskForm />{" "}
						</PrivateRoute>
					}
				/>

				{/*
                  Show/edit paths (with ID parameter)
              */}
				<Route
					path="/simulation/category/:id"
					element={
						<PrivateRoute>
							{" "}
							<CategoryForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/talent/:id"
					element={
						<PrivateRoute>
							{" "}
							<TalentForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/worker/:id"
					element={
						<PrivateRoute>
							{" "}
							<WorkerForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/backlog/:id"
					element={
						<PrivateRoute>
							{" "}
							<BacklogForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/project/:id"
					element={
						<PrivateRoute>
							{" "}
							<ProjectForm />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/simulation/task/:id"
					element={
						<PrivateRoute>
							{" "}
							<TaskForm />{" "}
						</PrivateRoute>
					}
				/>

				{/*
                  Simulate Project paths
              */}
				<Route
					path="/simulation/simulate"
					element={
						<PrivateRoute>
							{" "}
							<ProjectOverview />{" "}
						</PrivateRoute>
					}
				/>
				{/* <Route path='/simulate/sprint' element={<PrivateRoute> <DragList/> </PrivateRoute>} /> */}
				<Route
					path="/simulate/sprint"
					element={
						<PrivateRoute>
							{" "}
							{/* <DragListWrapper />{" "} */}
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
				{/*<Route path='/simulate/reviewSprint' element={<PrivateRoute> <SimulationSprintReview/> </PrivateRoute>} />*/}
				<Route
					path="/simulate/reviewProject"
					element={
						<PrivateRoute>
							{" "}
							<ProjectSimulationReview />{" "}
						</PrivateRoute>
					}
				/>

				{/*
                  Admin Routes
              */}
				<Route
					path="/center"
					element={
						<PrivateRoute>
							{" "}
							<AdminCenter />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/user"
					element={
						<PrivateRoute>
							{" "}
							<UserList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/project"
					element={
						<PrivateRoute>
							{" "}
							<ProjectList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/backlog"
					element={
						<PrivateRoute>
							{" "}
							<BacklogList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/task"
					element={
						<PrivateRoute>
							{" "}
							<TaskList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/worker"
					element={
						<PrivateRoute>
							{" "}
							<WorkerList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/talent"
					element={
						<PrivateRoute>
							{" "}
							<TalentList />{" "}
						</PrivateRoute>
					}
				/>
				<Route
					path="/center/category"
					element={
						<PrivateRoute>
							{" "}
							<CategoryList />{" "}
						</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	</SocketContext.Provider>,
	rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
