import React from "react";
import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";

// @ts-ignore
const DraggableElement = ({ prefix, elements }) => (
	<div
		style={{ margin: "1%", backgroundColor: "lightgray", borderRadius: 10 }}
		data-cy="simulator-col"
	>
		<h1
			style={{ marginTop: "1%", textAlign: "center" }}
			data-cy={prefix}
			key={prefix}
		>
			{prefix}
		</h1>
		<Droppable droppableId={`${prefix}`} data-cy="element">
			{(provided) => (
				<div
					{...provided.droppableProps}
					ref={provided.innerRef}
					style={{ minWidth: 300 }}
				>
					{elements.map((item: { id: any }, index: any) => (
						<ListItem key={item.id} item={item} index={index} />
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	</div>
);

export default DraggableElement;
