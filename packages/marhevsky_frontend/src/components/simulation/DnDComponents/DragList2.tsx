import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import IProject from "../../../interfaces/project";
import ITask from "../../../interfaces/task";
import DraggableElement from "./DraggableElement";

const getItems = (tasks: Array<ITask>, prefix: string) =>
	tasks.map((task) => {
		return {
			id: task._id,
			prefix: prefix,
			task: task,
		};
	});

const removeFromList = (list: any, index: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(index, 1);
	return [removed, result];
};

const addToList = (list: any, index: number, element: unknown) => {
	const result = Array.from(list);
	result.splice(index, 0, element);
	return result;
};

let lists = ["Tasks"];

interface Props {
	allTasks: Array<ITask>;
	currentProject: IProject;
}

function DragList(props: Props) {
	const [sprintNo, setSprintNo] = useState(1);
	const [sprintCapacity, setSprintCapacity] = useState(100);
	const [isHidden, setIsHidden] = useState(true);

	const generateLists = () =>
		lists.reduce(
			(acc, listKey) => ({
				...acc,
				[listKey]: listKey === "Tasks" ? getItems(props.allTasks, listKey) : [],
			}),
			{}
		);

	const [elements, setElements] = useState(generateLists());

	let navigate = useNavigate();
	const openBacklog = (elements: {}) => {
		let path = `/simulate/backlog`;
		navigate(path, {
			state: {
				element: elements,
				project: props.currentProject,
				sprintCapacity: sprintCapacity,
			},
		});
	};

	const onDragEnd = (result: any) => {
		if (!result.destination) {
			return;
		}
		const listCopy = { ...elements };

		// @ts-ignore
		const sourceList = listCopy[result.source.droppableId];
		const [removedElement, newSourceList] = removeFromList(
			sourceList,
			result.source.index
		);
		// @ts-ignore
		listCopy[result.source.droppableId] = newSourceList;
		// @ts-ignore
		const destinationList = listCopy[result.destination.droppableId];
		// @ts-ignore
		listCopy[result.destination.droppableId] = addToList(
			destinationList,
			result.destination.index,
			removedElement
		);
		setElements(listCopy);
	};

	useEffect(() => {
		console.log(props.allTasks);
		lists = ["Tasks"];
		for (let i = 0; i < sprintNo; i++) {
			lists.push("Sprint " + (i + 1));
		}
		console.log(lists);
		setElements(generateLists());
		console.log(generateLists());
	}, [sprintNo]);

	return (
		<div style={{ margin: "5%" }}>
			<div>
				<form
					onSubmit={(e: React.SyntheticEvent) => {
						e.preventDefault();
						const target = e.target as typeof e.target & {
							sprintNo: { value: number };
						};
						setSprintNo(target.sprintNo.value);
						setIsHidden(false);
					}}
				>
					<label>
						Pick No. of Sprints per Project :
						<input
							type="number"
							name="sprintNo"
							defaultValue={sprintNo}
							min={1}
						/>
					</label>
					<div style={{ margin: "1%" }}>
						<Button
							size={"large"}
							variant="contained"
							type="submit"
							value="Submit"
						>
							Submit
						</Button>
					</div>
				</form>
			</div>
			<div className="dragdrop" hidden={isHidden}>
				<DragDropContext onDragEnd={onDragEnd}>
					<div style={{ display: "flex" }}>
						{lists.map((listKey) => (
							<DraggableElement
								// @ts-ignore
								elements={elements[listKey]}
								key={listKey}
								prefix={listKey}
							/>
						))}
					</div>
				</DragDropContext>

				<Button
					style={{ margin: "1%" }}
					variant="contained"
					size={"large"}
					name="project/backlog"
					onClick={() => openBacklog(elements)}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
export default DragList;
