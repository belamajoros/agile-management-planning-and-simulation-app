import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Fab } from "@mui/material";
import React, { useContext, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { SocketContext } from "../../context/socket";
import { GroupChatMessages } from "../../interfaces/chat";
import "../../style/Chat.css";
import TokenUtilService from "../../utils/token-util";

interface Props {
	room: string;
}

function ChatComponent({ room }: Props) {
	const [showChat, setShowChat] = React.useState<boolean>(false);
	const [messages, setMessages] = React.useState<GroupChatMessages[]>([]);
	const [currentMessage, setCurrentMessage] = React.useState<string>("");

	const socket = useContext(SocketContext);

	const username = TokenUtilService.getCurrentUserName() || "user";
	const userId = TokenUtilService.getCurrentUserId() || "";

	const handleReceiveMessage = (data: {
		senderId: string;
		username: string;
		content: string;
		timestamp: string;
	}) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{
				senderId: data.senderId,
				username: data.username,
				content: data.content,
				timestamp: new Date(data.timestamp),
			},
		]);
	};

	const sendMessage = () => {
		socket.emit("send_message", {
			id: room,
			senderId: userId,
			username: username,
			content: currentMessage,
			timestamp: new Date(),
		});
		setMessages((messages) => [
			...messages,
			{
				senderId: userId,
				username: username,
				content: currentMessage,
				timestamp: new Date(),
			},
		]);
		setCurrentMessage("");
	};

	useEffect(() => {
		socket.on("receive_message", handleReceiveMessage);

		return () => {
			socket.off("receive_message", handleReceiveMessage);
		};
	}, [socket]);

	return (
		<>
			<div className={`chat-window ${showChat ? "show" : ""}`}>
				<div className="chat-body">
					<ScrollToBottom className="message-container">
						{messages.length > 0
							? messages.map((messageContent: GroupChatMessages) => {
									const date = new Date(messageContent.timestamp);
									const year = date.getFullYear().toString().slice(-2);
									const month = date.getMonth() + 1;
									const day = date.getDate();
									const hour = date.getHours();
									const minute = date.getMinutes();
									const hour24 = hour < 10 ? `0${hour}` : hour;
									const minute24 = minute < 10 ? `0${minute}` : minute;
									return (
										<div
											className="message"
											id={userId === messageContent.senderId ? "you" : "other"}
										>
											<div>
												<div className="message-content">
													<p>{messageContent.content}</p>
												</div>
												<div className="message-meta">
													<p id="author" className="mr-1">
														{messageContent.username}
													</p>
													<p id="time">
														{hour24}:{minute24}
													</p>
													{/* <p id="author">{messageContent.username}</p> */}
												</div>
											</div>
										</div>
									);
							  })
							: null}
					</ScrollToBottom>
				</div>
				<div className="chat-footer d-flex">
					<input
						type="text"
						className="form-control justify-content-start"
						value={currentMessage}
						placeholder="Your message.."
						onChange={(event) => {
							setCurrentMessage(event.target.value);
						}}
						onKeyPress={(event) => {
							event.key === "Enter" && sendMessage();
						}}
					/>
					<button onClick={sendMessage}>&#9658;</button>
				</div>
			</div>
			{showChat ? (
				<Fab className="chat" color="error" aria-label="add">
					<CloseIcon onClick={() => setShowChat(!showChat)} />
				</Fab>
			) : (
				<Fab className="chat" color="primary" aria-label="add">
					<ChatIcon onClick={() => setShowChat(!showChat)} />
				</Fab>
			)}
		</>
	);
}

export default ChatComponent;
