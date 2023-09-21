import { Card } from "@mui/material";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

// @ts-ignore
const ListItem = ({ item, index }) => {
	return (
		<>
			<div style={{ margin: "4%", borderRadius: 20 }}>
				<Draggable draggableId={item.id} index={index}>
					{(provided, snapshot) => {
						return (
							<div
								ref={provided.innerRef}
								// @ts-ignore
								snapshot={snapshot}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
							>
								<Card sx={{ minWidth: 275 }} variant={"outlined"}>
									<h3
										style={{ marginTop: "1%", textAlign: "center" }}
										data-cy={item.task.title}
									>
										{item.task.title}
									</h3>
									<div>
										<div style={{ margin: "0% 10% 5% 10%" }}>
											<p>{item.description}</p>
											<p>Estimation : {item.task.estimation}</p>
											<p>Priority : {item.task.priority}</p>
										</div>
									</div>
								</Card>
							</div>
						);
					}}
				</Draggable>
			</div>
		</>
	);
};

export default ListItem;
