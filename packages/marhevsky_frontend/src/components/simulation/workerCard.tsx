import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import ITalent from "../../interfaces/talent";
import ITask from "../../interfaces/task";
import IWorker from "../../interfaces/worker";
import { calculateWorkerEstimation } from "../../services/backlogService";
import { getWorkerTalents } from "../../services/workerService";
import "../../style/TextSlide.css";
import { BacklogCalculationProp, WorkerLog } from "./sprintComponent";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

interface WorkerProp {
	worker: IWorker;
	backlogs: Array<BacklogCalculationProp>;
	setBacklogProps: (workerId: string, backlogProps: WorkerLog) => void;
	setWorkerCapacity: (workerId: string, capacity: number) => void;
	setWorkerUsedCapacity: (workerId: string, capacity: number) => void;
	workerCapacity: number;
	sprintNumber: number;
	workLogMap: Map<string, WorkerLog>;
	eventHandlerProp: boolean;
	currentProjectId: string;
}

export const WorkerCard = (workerProp: WorkerProp) => {
	const [taskIds, setTasksForWorker] = React.useState<string[]>([]);
	const socket = useContext(SocketContext);

	const [usedWorkerCapacity, setUsedWorkerCapacity] = useState<number>(
		workerProp.workerCapacity
	);
	const [totalWorkerCapacity, setTotalWorkerCapacity] = useState<number>(
		workerProp.workerCapacity
	);

	const [send, setSend] = useState<boolean>(false);

	const [workerTalents, setWorkerTalents] = useState<
		Array<ITalent> | undefined
	>(undefined);

	const handleChange = (event: SelectChangeEvent<typeof taskIds>) => {
		const {
			target: { value },
		} = event;
		const data = typeof value === "string" ? value.split(",") : value;
		setTasksForWorker(data);
		socket.emit("send_task_ids", {
			id: workerProp.currentProjectId,
			workerId: workerProp.worker._id,
			taskIds: value,
		});
		console.log(`Sending task ids ${value}`);
		/* setSend(true); */
	};

	const fillWorker = () => {};

	React.useEffect(() => {
		fillWorker();
		getWorkerTalents(workerProp.worker._id as string).then((response) =>
			setWorkerTalents(response)
		);
	}, []);

	React.useEffect(() => {
		setTasksForWorker([]);
		setTotalWorkerCapacity(workerProp.workerCapacity);
		setUsedWorkerCapacity(workerProp.workerCapacity);
	}, [workerProp.backlogs]);

	React.useEffect(() => {}, [workerTalents]);

	function calculateAndRenderEstimationFromBacklog(
		backlog: BacklogCalculationProp
	) {
		if (backlog.task && backlog.task.estimation) {
			if (workerTalents && backlog.task.estimation) {
				let estimatedValue = calculateWorkerCapacity(
					backlog,
					backlog.backlog!.worker!.includes(workerProp.worker!._id as string)
						? false
						: true
				);
				return (
					<div className="cont">
						<ListItemText
							className="slidingText"
							primary={
								backlog.task.title +
								" : " +
								estimatedValue.toFixed(2) +
								"h" +
								getInfoLabelAboutNextSprint(backlog)
							}
						/>
					</div>
				);
			}
		}
		return "";
	}

	function calculateEstimation(
		originEstimation: number,
		talents: Array<ITalent>
	) {
		if (talents) {
			return talents.reduce(
				(acc, talent) =>
					acc - (acc * (talent.buff_value ? talent.buff_value : 0)) / 100 > 0
						? acc - (acc * (talent.buff_value ? talent.buff_value : 0)) / 100
						: 0,
				originEstimation ? originEstimation : 0
			);
		}
		return originEstimation;
	}

	useEffect(() => {
		console.log(workerProp.backlogs);
		let backlogProps = {
			workerHours: 0,
			backlogs: workerProp.backlogs
				.filter(
					(backlog) =>
						backlog.backlog.sprintNo === workerProp.sprintNumber && backlog.task
				)
				.filter((sprintBacklog) =>
					taskIds.includes(sprintBacklog.backlog._id as string)
				),
		};
		console.log(backlogProps);
		workerProp.setBacklogProps(workerProp.worker._id as string, backlogProps);
		/* if (send) {
			console.log(backlogProps);
			socket.emit("send_updated_backlog_props", {
				id: workerProp.currentProjectId,
				workerId: workerProp.worker._id as string,
				backlogProps: backlogProps,
				taskIds: taskIds,
			});
			setSend(false);
		}
		console.log(taskIds);
		console.log(backlogProps); */
	}, [taskIds]);

	const handleReceivedUpdatedBacklogProps = (data: {
		workerId: string;
		backlogProps: WorkerLog;
		taskIds: string[];
	}) => {
		console.log(data);
		console.log(workerProp.worker._id);
		console.log(data.workerId);
		if (workerProp.worker._id === data.workerId) {
			console.log(taskIds);
			console.log(`Received task ids ${data.taskIds}`);
			setTasksForWorker(data.taskIds);
			workerProp.setBacklogProps(data.workerId, data.backlogProps);
		}
	};

	const handleReceivedTaskIds = (data: {
		taskIds: string[];
		workerId: string;
	}) => {
		if (workerProp.worker._id === data.workerId) {
			setTasksForWorker(data.taskIds);
		}
	};

	const handleReceivedCapacityChange = (data: {
		value: string;
		workerId: string;
	}) => {
		if (data.workerId === workerProp.worker._id) {
			setTotalWorkerCapacity(+data.value);
			setUsedWorkerCapacity(+data.value);
			workerProp.setWorkerUsedCapacity(
				workerProp.worker._id as string,
				+data.value
			);
			workerProp.setWorkerCapacity(
				workerProp.worker._id as string,
				+data.value
			);
		}
		/* setTotalWorkerCapacity(+data.value);
		setUsedWorkerCapacity(+data.value);
		workerProp.setWorkerUsedCapacity(
			workerProp.worker._id as string,
			+data.value
		);
		workerProp.setWorkerCapacity(workerProp.worker._id as string, +data.value); */
	};

	useEffect(() => {
		socket.on(
			"receive_updated_backlog_props",
			handleReceivedUpdatedBacklogProps
		);

		socket.on("receive_task_ids", handleReceivedTaskIds);

		socket.on("receive_capacity_change", handleReceivedCapacityChange);
		return () => {
			socket.off(
				"receive_updated_worker_tasks",
				handleReceivedUpdatedBacklogProps
			);
			socket.off("receive_task_ids", handleReceivedTaskIds);
			socket.off("receive_capacity_change", handleReceivedCapacityChange);
		};
	}, [socket]);

	useEffect(() => {
		console.log("Answer from " + workerProp.worker.name);
	}, [workerProp.workLogMap]);

	const eventHandlerTrigger = () => {
		if (workerProp && workerProp.worker._id) {
			const workerBacklog: Array<BacklogCalculationProp> =
				workerProp!.workLogMap!.get(workerProp.worker._id)!.backlogs!;
			if (workerBacklog) {
				const workerUsedCapacity = workerBacklog.reduce(
					(acc, backlog) =>
						acc - calculateWorkerCapacity(backlog) >= 0
							? acc - calculateWorkerCapacity(backlog)
							: 0,
					totalWorkerCapacity
				);
				// const buffedEstimation = calculateEstimation(workerUsedCapacity, workerTalents ? workerTalents : []);
				setUsedWorkerCapacity(workerUsedCapacity);
				workerProp.setWorkerUsedCapacity(
					workerProp.worker._id as string,
					workerUsedCapacity
				);
			}
		}
	};

	useEffect(() => {
		eventHandlerTrigger();
		/* if (workerProp && workerProp.worker._id) {
			const workerBacklog: Array<BacklogCalculationProp> =
				workerProp!.workLogMap!.get(workerProp.worker._id)!.backlogs!;
			if (workerBacklog) {
				const workerUsedCapacity = workerBacklog.reduce(
					(acc, backlog) =>
						acc - calculateWorkerCapacity(backlog) >= 0
							? acc - calculateWorkerCapacity(backlog)
							: 0,
					totalWorkerCapacity
				);
				// const buffedEstimation = calculateEstimation(workerUsedCapacity, workerTalents ? workerTalents : []);
				setUsedWorkerCapacity(workerUsedCapacity);
				workerProp.setWorkerUsedCapacity(
					workerProp.worker._id as string,
					workerUsedCapacity
				);
			}
		} */
	}, [workerProp.eventHandlerProp]);

	function calculateWorkerCapacity(
		backlogCalculationProp: BacklogCalculationProp,
		check = false
	): number {
		const talentMap = new Map([
			[workerProp.worker._id as string, workerTalents ? workerTalents : []],
		]);
		let workerLength =
			backlogCalculationProp.backlog!.worker!.length >= 1
				? backlogCalculationProp.backlog!.worker!.length
				: 0;
		if (check) {
			workerLength = workerLength + 1;
		}
		const estimation = backlogCalculationProp.task.estimation
			? backlogCalculationProp.task.estimation -
			  (backlogCalculationProp.task.estimation *
					backlogCalculationProp.backlog.progress!) /
					100
			: 0;
		return calculateWorkerEstimation(
			backlogCalculationProp,
			estimation / workerLength,
			workerProp.worker,
			talentMap
		);
	}

	function getLabel(id: string) {
		for (
			let i = 0;
			i < workerProp.backlogs.map((backlog) => backlog.task).length;
			i++
		) {
			if (workerProp.backlogs[i].backlog._id === id) {
				return (
					workerProp.backlogs[i].task.title +
					" : estimated " +
					workerProp.backlogs[i].task.estimation +
					"h"
				);
			}
		}
		return "";
	}

	function getTask(id: string): ITask | undefined {
		for (
			let i = 0;
			i < workerProp.backlogs.map((backlog) => backlog.task).length;
			i++
		) {
			if (workerProp.backlogs[i].task._id === id) {
				return workerProp.backlogs[i].task;
			}
		}
		return undefined;
	}

	const getInfoLabelAboutNextSprint = (backlog: BacklogCalculationProp) => {
		const workerEstimation = calculateWorkerCapacity(backlog, true);

		if (
			usedWorkerCapacity - workerEstimation < 0 &&
			!taskIds.includes(backlog.backlog._id as string)
		) {
			return (
				" : " +
				Math.abs(usedWorkerCapacity - workerEstimation).toFixed(2) +
				"h to next Sprint"
			);
		} else {
			return "";
		}
	};

	const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTotalWorkerCapacity(+e.target.value);
		setUsedWorkerCapacity(+e.target.value);
		workerProp.setWorkerUsedCapacity(
			workerProp.worker._id as string,
			+e.target.value
		);
		workerProp.setWorkerCapacity(
			workerProp.worker._id as string,
			+e.target.value
		);
		socket.emit("send_capacity_change", {
			id: workerProp.currentProjectId,
			workerId: workerProp.worker._id as string,
			value: e.target.value,
		});
	};

	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography variant="h5" component="div"></Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{workerProp.worker.name}
				</Typography>
				<Typography variant="body2">
					{workerProp.worker.description}
					<br />
				</Typography>
				<label>
					Worker Capacity:
					<input
						type="number"
						name="workerCapacity"
						onChange={(e) => {
							handleCapacityChange(e);
							/* setTotalWorkerCapacity(+e.target.value);
							setUsedWorkerCapacity(+e.target.value);
							workerProp.setWorkerUsedCapacity(
								workerProp.worker._id as string,
								+e.target.value
							);
							workerProp.setWorkerCapacity(
								workerProp.worker._id as string,
								+e.target.value
							); */
						}}
						data-cy="worker-capacity-input"
						value={totalWorkerCapacity.toFixed(2)}
						/* defaultValue={usedWorkerCapacity.toFixed(2)} */
						min={0}
					/>
				</label>
				<br />
				<label>
					Free Capacity:
					<input
						readOnly={true}
						type="number"
						name="usedWorkerCapacity"
						value={usedWorkerCapacity.toFixed(2)}
						min={0}
						data-cy="used-worker-capacity-input"
					/>
				</label>
			</CardContent>
			<InputLabel id="demo-multiple-checkbox-label">Tasks</InputLabel>
			<FormControl fullWidth>
				<Select
					labelId="demo-multiple-checkbox-label"
					id="demo-multiple-checkbox"
					multiple
					value={taskIds}
					required={taskIds.length === 0}
					onChange={handleChange}
					data-cy="task-select"
					input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
					renderValue={(selected) => (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
							{selected.map((taskId) => (
								<Chip key={taskId} label={getLabel(taskId)} />
							))}
						</Box>
					)}
					MenuProps={MenuProps}
				>
					{
						workerProp.backlogs.map((backlog) => {
							console.log(backlog);
							return (
								<MenuItem
									key={backlog.backlog._id}
									value={backlog.backlog._id}
									style={{ overflow: "hidden" }}
									data-cy="select-tasks-item"
								>
									<Checkbox
										checked={taskIds.includes(backlog.backlog._id as string)}
									/>
									{workerTalents ? (
										calculateAndRenderEstimationFromBacklog(backlog)
									) : (
										<CircularProgress />
									)}
								</MenuItem>
							);
						})
						/* )) */
					}
				</Select>
			</FormControl>
		</Card>
	);
};
