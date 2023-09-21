import { Card, CardContent, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { createBacklog, updateBacklog } from "../../api/backlogApi";
import { getWorkerById } from "../../api/workerApi";
import Project from "../../classes/project";
import { SocketContext } from "../../context/socket";
import IBacklog from "../../interfaces/backlog";
import { GroupChatMessages } from "../../interfaces/chat";
import IProject from "../../interfaces/project";
import ITalent from "../../interfaces/talent";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";
import {
	calculateBacklogProgress,
	moveBacklogsToNextSprint,
} from "../../services/backlogService";
import { addBacklogsToProject } from "../../services/projectService";
import { getWorkerTalents } from "../../services/workerService";
import "../../style/Chat.css";
import TokenUtilService from "../../utils/token-util";
import { TaskContentProp } from "./assignTasks";
import ChatComponent from "./chat";
import SimulationSprintReview from "./simulationSprintReview";
import { WorkerCard } from "./workerCard";
// @ts-nocheck

export interface ISprintProps {
	sprints: Array<string>;
	backlogTasks: Map<string, Array<IncomingBacklog>>;
	project: IProject;
	sprintCapacity: number;
}

export interface BacklogCalculationProp {
	backlog: IBacklog;
	task: ITask;
	estimationMap?: Map<string, number>;
}

export interface IncomingBacklog {
	backlog: IBacklog;
	task: TaskContentProp;
}

export interface WorkerLog {
	workerHours: number;
	backlogs: Array<BacklogCalculationProp>;
}

export function SprintComponent(sprintProp: ISprintProps) {
	const [sprints, setSprints] = useState<Array<string>>([]);
	const [tasks, setTasks] = useState<Map<string, Array<ITask>>>(new Map());

	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set<number>());

	const [currentTasks, setCurrentTasks] = useState<Array<ITask>>([]);
	const [currentBacklogs, setCurrentBacklogs] = useState<
		Array<BacklogCalculationProp>
	>([]);

	const [inReview, setReview] = useState<boolean>(true);
	const socket = useContext(SocketContext);

	const [currentWorkers, setCurrentWorkers] = useState<Array<IWorker>>([]);
	const [talentsMap, setTalentsMap] = useState<Map<string, Array<ITalent>>>(
		new Map()
	);
	const [tasksMap, setTaskMap] = useState<
		Map<string, Array<BacklogCalculationProp>>
	>(new Map());

	const userId = TokenUtilService.getCurrentUserId();

	//CAP Calculation hooks
	const [workerLogMap, setWorkerLogMap] = useState<Map<string, WorkerLog>>(
		new Map()
	);

	const [usedTaskCapacity, setUsedTaskCapacity] = useState<number>(0);
	const [workerCapacity, setTotalWorkerCapacity] = useState<number>(0);
	const [usedWorkerCapacity, setUsedWorkerCapacity] = useState<number>(0);
	const [workerCapacityMap, setWorkerCapacityMap] = useState<
		Map<string, number>
	>(new Map());
	const [workerUsedCapacityMap, setWorkerUsedCapacityMap] = useState<
		Map<string, number>
	>(new Map());

	const [changedLogEventHandler, setChangedLogEventHandler] =
		useState<boolean>(false);
	const [notCompletedTasks, setNotCompletedTasks] = useState<
		Array<BacklogCalculationProp>
	>([]);

	const isStepOptional = (step: number) => {
		return false;
	};

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const getWorkers = async () => {
		if (sprintProp.project) {
			let temp: Array<IWorker> = [];
			if (sprintProp.project.team) {
				for (const id of sprintProp.project.team) {
					await getWorkerById(id)
						.then((worker) => {
							temp.push(worker);
						})
						.catch((e) => {
							console.log(e);
						});
				}
			}
			setCurrentWorkers(temp);
		} else {
			console.log("no workers assigned to this project !");
		}
		console.log(currentWorkers);
	};

	const handleNext = useCallback(() => {
		if (activeStep === sprints.length - 1) {
			const projectId = sprintProp.project._id;
			socket.emit("send_review_project", {
				id: projectId,
				project: sprintProp.project,
			});
			navigate("/simulate/reviewProject", { state: sprintProp.project });
		} else {
			let newSkipped = skipped;
			if (isStepSkipped(activeStep)) {
				newSkipped = new Set(newSkipped.values());
				newSkipped.delete(activeStep);
			}
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
			setSkipped(newSkipped);
			setReview(true);
		}
	}, [activeStep]);

	// EXTERNAL FUNCTION for child -> parent communication
	function setTaskMapWithChild(workerId: string, workerLog: WorkerLog) {
		workerLogMap.set(workerId, workerLog);
		setWorkerLogMap(workerLogMap);
		let usedCap = 0;
		currentBacklogs.forEach((currentBacklog) => {
			currentBacklog.backlog.worker = [];
			workerLogMap.forEach((log, workerId) => {
				if (log.backlogs.includes(currentBacklog)) {
					currentBacklog.backlog.worker!.push(workerId);
					calculateProgress(currentBacklog, workerId);
				}
			});
		});
		setUsedTaskCapacity(usedCap);
		setUsedWorkerCapacity(usedCap);
		console.log(changedLogEventHandler);
		setChangedLogEventHandler(!changedLogEventHandler);
		console.log(changedLogEventHandler);
	}

	function calculateProgress(
		backlogProps: BacklogCalculationProp,
		workerId: string
	) {
		// const talents = talentsMap.get(workerId);
		// let finalWorkerProgress = backlogProps.task.estimation;
		// if (finalWorkerProgress) {
		//     if (talents) {
		//         finalWorkerProgress = talents.reduce((acc, talent) => (acc - (acc * (talent.buff_value ? talent.buff_value : 0) / 100)) > 0 ? acc - (acc * (talent.buff_value ? talent.buff_value : 0) / 100) : 0,
		//             backlogProps.task.estimation ? backlogProps.task.estimation : 0);
		//     }
		//     if (backlogProps.backlog.worker!.length > 1) {
		//         backlogProps.estimationMap?.set(workerId, ((backlogProps.backlog.progress ? backlogProps.backlog.progress : 0) + finalWorkerProgress) / 2);
		//     } else {
		//         backlogProps.estimationMap?.set(workerId, (backlogProps.backlog.progress ? backlogProps.backlog.progress : 0) + finalWorkerProgress);
		//     }
		// }
	}

	const navigate = useNavigate();

	/* function setWorkerCapacity(workerId: string, capacity: number) {
		console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
		console.log(workerCapacityMap);
		workerCapacityMap.set(workerId, capacity);
		setWorkerCapacityMap(workerCapacityMap);
		console.log(workerCapacityMap);
		let usedWorkerCapacity = 0;
		workerCapacityMap.forEach((workerCap) => {
			usedWorkerCapacity = usedWorkerCapacity + workerCap;
		});
		console.log(usedWorkerCapacity);
		setTotalWorkerCapacity(usedWorkerCapacity);
	} */

	/* const setWorkerCapacity = useMemo(() => {
		return (workerId: string, capacity: number) => {
			console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
			console.log(workerCapacityMap);
			workerCapacityMap.set(workerId, capacity);
			setWorkerCapacityMap(workerCapacityMap);
			console.log(workerCapacityMap);
			let usedWorkerCapacity = 0;
			workerCapacityMap.forEach((workerCap) => {
				usedWorkerCapacity = usedWorkerCapacity + workerCap;
			});
			console.log(usedWorkerCapacity);
			setTotalWorkerCapacity(usedWorkerCapacity);
		};
	}, [workerCapacityMap, setWorkerCapacityMap, setTotalWorkerCapacity]); */

	/* const setWorkerCapacity = useCallback(
		(workerId: string, capacity: number) => {
			console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
			console.log(workerCapacityMap);
			workerCapacityMap.set(workerId, capacity);
			setWorkerCapacityMap(workerCapacityMap);
			console.log(workerCapacityMap);
			let usedWorkerCapacity = 0;
			workerCapacityMap.forEach((workerCap) => {
				usedWorkerCapacity = usedWorkerCapacity + workerCap;
			});
			console.log(usedWorkerCapacity);
			setTotalWorkerCapacity(usedWorkerCapacity);
		},
		[workerCapacityMap, setWorkerCapacityMap]
	); */
	/* function setWorkerCapacity(workerId: string, capacity: number) {
		console.log(workerCapacityMap);
		const newWorkerCapacityMap = new Map(workerCapacityMap);
		newWorkerCapacityMap.set(workerId, capacity);
		setWorkerCapacityMap(newWorkerCapacityMap);
		let usedWorkerCapacity = 0;
		newWorkerCapacityMap.forEach((workerCap) => {
			usedWorkerCapacity = usedWorkerCapacity + workerCap;
		});
		setTotalWorkerCapacity(usedWorkerCapacity);
	} */
	function setWorkerCapacity(workerId: string, capacity: number) {
		setWorkerCapacityMap((prevWorkerCapacityMap) => {
			console.log(prevWorkerCapacityMap);
			const newWorkerCapacityMap = new Map(prevWorkerCapacityMap);
			newWorkerCapacityMap.set(workerId, parseFloat(capacity.toFixed(2)));

			let usedWorkerCapacity = 0;
			newWorkerCapacityMap.forEach((workerCap) => {
				usedWorkerCapacity = usedWorkerCapacity + workerCap;
			});
			setTotalWorkerCapacity(usedWorkerCapacity);

			return newWorkerCapacityMap;
		});
	}

	/* function setWorkerUsedCapacity(workerId: string, capacity: number) {
		console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
		workerUsedCapacityMap.set(workerId, capacity);
		setWorkerUsedCapacityMap(workerUsedCapacityMap);
	} */
	/* function setWorkerUsedCapacity(workerId: string, capacity: number) {
		console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
		console.log(workerUsedCapacityMap);
		const newWorkerUsedCapacityMap = new Map(workerUsedCapacityMap);
		newWorkerUsedCapacityMap.set(workerId, capacity);
		setWorkerUsedCapacityMap(newWorkerUsedCapacityMap);
	} */
	/* const setWorkerUsedCapacity = useCallback(
		(workerId: string, capacity: number) => {
			console.log(`WorkerId ${workerId}, capacity: ${capacity}`);
			console.log(workerUsedCapacityMap);
			const newWorkerUsedCapacityMap = new Map(workerUsedCapacityMap);
			newWorkerUsedCapacityMap.set(workerId, capacity);
			setWorkerUsedCapacityMap(newWorkerUsedCapacityMap);
		},
		[workerUsedCapacityMap]
	); */
	function setWorkerUsedCapacity(workerId: string, capacity: number) {
		setWorkerUsedCapacityMap((prevWorkerUsedCapacityMap) => {
			console.log(prevWorkerUsedCapacityMap);
			const newWorkerUsedCapacityMap = new Map(prevWorkerUsedCapacityMap);
			newWorkerUsedCapacityMap.set(workerId, capacity);
			return newWorkerUsedCapacityMap;
		});
	}

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	useEffect(() => {
		console.log("Worker cap");
		console.log(workerCapacity.toFixed(2));
	}, [workerCapacity]);

	useEffect(() => {
		setSprints(sprintProp.sprints);
		if (sprintProp.backlogTasks) {
			console.log(sprintProp);
		}
	}, []);

	useEffect(() => {}, [sprintProp.backlogTasks]);

	useEffect(() => {
		setSprints(sprintProp.sprints);
		const currentTasksTemp = sprintProp.backlogTasks.get(
			sprintProp.sprints[activeStep]
		);

		if (currentTasksTemp) {
			setCurrentTasks(currentTasksTemp.map((prop) => prop.task.task));
			getWorkers();
		}
	}, [activeStep]);

	useEffect(() => {
		const fetchData = async (backlogs: Array<IBacklog>) => {
			const newBacklogs = [];
			for (const backlog of backlogs) {
				newBacklogs.push(await createBacklog(backlog));
			}
			console.log(newBacklogs);
			return newBacklogs;
		};
		setTaskMap(new Map());
		if (userId === sprintProp.project.creator) {
			const arrayOfNewlyCreatedBacklogs = [] as Array<string>;
			const arrayOfBacklogs = [] as Array<BacklogCalculationProp>;
			setCurrentBacklogs([...notCompletedTasks]);
			const backlogsPromises = fetchData(
				sprintProp
					.backlogTasks!.get(sprintProp.sprints[activeStep])!
					.map((incomingBacklog) => incomingBacklog.backlog)
			);
			backlogsPromises.then((arrayOfNewBacklogs) => {
				addBacklogsToProject(
					sprintProp.project._id as string,
					arrayOfNewBacklogs.map((backlogs) => backlogs._id as string)
				);
				arrayOfNewBacklogs.forEach((r) => {
					if (r._id && sprintProp.project._id) {
						arrayOfNewlyCreatedBacklogs.push(r._id as string);
						arrayOfBacklogs.push({
							task: currentTasks.find((task) => task._id === r.task),
							backlog: r,
						} as BacklogCalculationProp);

						if (sprintProp.project._id) {
							console.log([...arrayOfBacklogs, ...notCompletedTasks]);
							setCurrentBacklogs([...arrayOfBacklogs, ...notCompletedTasks]);
						}
					}
					console.log([...arrayOfBacklogs, ...notCompletedTasks]);
					socket.emit("send_backlogs", {
						currentBacklogs: [...arrayOfBacklogs, ...notCompletedTasks],
						id: sprintProp.project._id,
					});
				});
			});
		}
		/* const arrayOfNewlyCreatedBacklogs = [] as Array<string>;
		const arrayOfBacklogs = [] as Array<BacklogCalculationProp>;
		setCurrentBacklogs([...notCompletedTasks]);
		const backlogsPromises = fetchData(
			sprintProp
				.backlogTasks!.get(sprintProp.sprints[activeStep])!
				.map((incomingBacklog) => incomingBacklog.backlog)
		);
		backlogsPromises.then((arrayOfNewBacklogs) => {
			addBacklogsToProject(
				sprintProp.project._id as string,
				arrayOfNewBacklogs.map((backlogs) => backlogs._id as string)
			);
			arrayOfNewBacklogs.forEach((r) => {
				if (r._id && sprintProp.project._id) {
					arrayOfNewlyCreatedBacklogs.push(r._id as string);
					arrayOfBacklogs.push({
						task: currentTasks.find((task) => task._id === r.task),
						backlog: r,
					} as BacklogCalculationProp);

					if (sprintProp.project._id) {
						setCurrentBacklogs([...arrayOfBacklogs, ...notCompletedTasks]);
					}
				}
			});
		}); */
	}, [currentTasks]);

	/* useEffect(() => {
		console.log("AAAA");
		const getBacklogs = (backlogs: Array<IBacklog>) => {
			const newBacklogs = [];
			for (const backlog of backlogs) {
				for (const propBacklog of sprintProp.backlogs) {
					if (
						propBacklog.task === backlog.task &&
						propBacklog.sprintNo === backlog.sprintNo
					) {
						newBacklogs.push(sprintProp.backlogs);
					}
				}
				if (sprintProp.backlogs.task === backlog.task && sprintProp.backlogs.sprintNo === backlog.sprintNo)
				newBacklogs.push(sprintProp.backlogs);
			}
			console.log(newBacklogs);
			return newBacklogs;
		};

		const arrayOfNewlyCreatedBacklogs = [] as Array<string>;
		const arrayOfBacklogs = [] as Array<BacklogCalculationProp>;
		setCurrentBacklogs([...notCompletedTasks]);
		const backlogsPromises = getBacklogs(
			sprintProp
				.backlogTasks!.get(sprintProp.sprints[activeStep])!
				.map((incomingBacklog) => incomingBacklog.backlog)
		);
		backlogsPromises.then((arrayOfNewBacklogs) => {
			addBacklogsToProject(
				sprintProp.project._id as string,
				arrayOfNewBacklogs.map((backlogs) => backlogs._id as string)
			);
			arrayOfNewBacklogs.forEach((r) => {
				if (r._id && sprintProp.project._id) {
					arrayOfNewlyCreatedBacklogs.push(r._id as string);
					arrayOfBacklogs.push({
						task: currentTasks.find((task) => task._id === r.task),
						backlog: r,
					} as BacklogCalculationProp);

					if (sprintProp.project._id) {
						setCurrentBacklogs([...arrayOfBacklogs, ...notCompletedTasks]);
					}
				}
			});
		});
	}, [currentTasks]); */

	useEffect(() => {
		setTotalWorkerCapacity(sprintProp.sprintCapacity);
		const workerCap = sprintProp.sprintCapacity / currentWorkers.length;
		let initialCapacities = currentWorkers.reduce(
			(acc, worker) =>
				new Map([
					...acc,
					...new Map([[worker._id, parseFloat(workerCap.toFixed(2))]]),
				]),
			new Map()
		) as Map<string, number>;
		setWorkerCapacityMap(initialCapacities);

		currentWorkers.forEach((worker) => {
			getWorkerTalents(worker._id as string).then((response) => {
				talentsMap.set(worker._id as string, response);
			});
		});
	}, [currentWorkers]);

	/* const reviewSprint = useCallback(() => {
		setReview(false);
		console.log(currentBacklogs);
		console.log(talentsMap);
		console.log(workerCapacityMap);
		calculateBacklogProgress(currentBacklogs, talentsMap, workerCapacityMap);
		currentBacklogs.forEach((currentBacklog) => {
			const data = {
				task: currentBacklog.task,
				worker: currentBacklog.backlog.worker,
				progress: currentBacklog.backlog.progress,
				sprintNo: currentBacklog.backlog.sprintNo,
			};
			updateBacklog(currentBacklog.backlog._id as string, data);
		});
		moveBacklogsToNextSprint(
			currentBacklogs,
			sprintProp.project._id as string
		).then((r) => {
			setNotCompletedTasks(r);
		});
	}, [currentBacklogs, sprintProp.project._id, talentsMap, workerCapacityMap]); */

	const reviewSprint = (
		currentBacklogs: Array<BacklogCalculationProp>,
		talentsMap: Map<string, Array<ITalent>>,
		workerCapacityMap: Map<string, number>
	) => {
		setReview(false);
		console.log(currentBacklogs);
		console.log(talentsMap);
		console.log(workerCapacityMap);
		calculateBacklogProgress(currentBacklogs, talentsMap, workerCapacityMap);
		console.log(currentBacklogs);
		currentBacklogs.forEach((currentBacklog) => {
			const data = {
				task: currentBacklog.task,
				worker: currentBacklog.backlog.worker,
				progress: currentBacklog.backlog.progress,
				sprintNo: currentBacklog.backlog.sprintNo,
			};
			updateBacklog(currentBacklog.backlog._id as string, data);
		});
		moveBacklogsToNextSprint(
			currentBacklogs,
			sprintProp.project._id as string
		).then((r) => {
			setNotCompletedTasks(r);
			socket.emit("send_review_sprint", {
				id: sprintProp.project._id,
				currentBacklogs: currentBacklogs,
				talentsMap: Object.fromEntries(talentsMap),
				workerCapacityMap: Object.fromEntries(workerCapacityMap),
				notCompletedTasks: r,
			});
		});
	};

	const handleReceivedBacklogs = (data: Array<BacklogCalculationProp>) => {
		console.log("received backlogs");
		console.log(data);
		setCurrentBacklogs(data);
	};

	const handleReceiveReviewSprint = (data: any) => {
		console.log(data);
		const talent = new Map(Object.entries(data.talentsMap)) as Map<
			string,
			ITalent[]
		>;
		const workerMap = new Map(Object.entries(data.workerCapacityMap)) as Map<
			string,
			number
		>;
		setReview(false);
		setCurrentBacklogs(data.currentBacklogs);
		setTalentsMap(talent);
		setWorkerCapacityMap(workerMap);
		setNotCompletedTasks(data.notCompletedTasks);
	};

	const handleReceiveClickNext = () => {
		handleNext();
	};

	useEffect(() => {
		console.log(activeStep);
	}, [activeStep]);

	const handleReceiveReviewProject = (data: IProject) => {
		navigate("/simulate/reviewProject", { state: data });
	};

	useEffect(() => {
		socket.on("receive_backlogs", handleReceivedBacklogs);

		socket.on("receive_review_sprint", handleReceiveReviewSprint);

		socket.on("receive_click_next", handleReceiveClickNext);

		socket.on("receive_review_project", handleReceiveReviewProject);

		return () => {
			socket.off("receive_backlogs", handleReceivedBacklogs);
			socket.off("receive_review_sprint", handleReceiveReviewSprint);
			socket.off("receive_click_next", handleReceiveClickNext);
			socket.off("receive_review_project", handleReceiveReviewProject);
		};
	}, [socket]);

	return (
		<>
			<Box sx={{ padding: "0.5em" }}>
				<Card>
					<CardContent>
						<Box padding={"1em"}>
							<Stepper activeStep={activeStep}>
								{sprints.map((label, index) => {
									const stepProps: { completed?: boolean } = {};
									const labelProps: {
										optional?: React.ReactNode;
									} = {};
									if (isStepOptional(index)) {
										labelProps.optional = (
											<Typography variant="caption">Optional</Typography>
										);
									}
									if (isStepSkipped(index)) {
										stepProps.completed = false;
									}
									return (
										<Step key={label} {...stepProps}>
											<StepLabel {...labelProps}>{label}</StepLabel>
										</Step>
									);
								})}
							</Stepper>
							{activeStep === sprints.length ? (
								<React.Fragment>
									<Typography sx={{ mt: 2, mb: 1 }}>
										All sprints completed - you&apos;re finished
									</Typography>
								</React.Fragment>
							) : (
								<React.Fragment>
									<Typography sx={{ mt: 2, mb: 1 }}>
										Sprint {activeStep + 1}
									</Typography>
									<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
										<Box sx={{ flex: "1 1 auto" }} />
										{isStepOptional(activeStep) && (
											<Button
												color="inherit"
												onClick={handleSkip}
												sx={{ mr: 1 }}
											>
												Skip
											</Button>
										)}
										<Button
											variant={"outlined"}
											disabled={!inReview}
											/* onClick={reviewSprint} */
											onClick={() => {
												reviewSprint(
													currentBacklogs,
													talentsMap,
													workerCapacityMap
												);
											}}
											data-cy="review-btn"
										>
											Review Sprint
										</Button>
										<Button
											variant={"outlined"}
											disabled={inReview}
											onClick={() => {
												handleNext();
												socket.emit("send_click_next", sprintProp.project._id);
											}}
											data-cy="next-btn"
										>
											{activeStep === sprints.length - 1 ? "Finish" : "Next"}
										</Button>
									</Box>
								</React.Fragment>
							)}
						</Box>
					</CardContent>
				</Card>
				<p data-cy="worker-capacity">
					Workers capacity: {workerCapacity.toFixed(2)} hours
				</p>
				<Card hidden={inReview}>
					<SimulationSprintReview
						sprintNo={activeStep + 1}
						project={sprintProp.project}
						backlogs={currentBacklogs}
					/>
				</Card>
				<div hidden={!inReview}>
					{currentBacklogs &&
					workerCapacityMap &&
					workerCapacityMap.size > 0 ? (
						<Box sx={{ display: "flex", flexDirection: "row" }}>
							{currentWorkers.map((worker) => (
								<WorkerCard
									backlogs={currentBacklogs}
									setBacklogProps={setTaskMapWithChild}
									setWorkerCapacity={setWorkerCapacity}
									setWorkerUsedCapacity={setWorkerUsedCapacity}
									workLogMap={workerLogMap}
									worker={worker}
									workerCapacity={
										workerCapacityMap.get(worker._id || "") ?? 0 /* ??
									sprintProp.sprintCapacity / currentWorkers.length */
									}
									sprintNumber={activeStep + 1}
									eventHandlerProp={changedLogEventHandler}
									currentProjectId={sprintProp.project._id || ""}
								/>
							))}
						</Box>
					) : (
						<CircularProgress />
					)}
				</div>
			</Box>
		</>
	);
}
