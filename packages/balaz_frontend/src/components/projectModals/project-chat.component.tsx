import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import io from 'socket.io-client';
import '../../App.css';
import AuthService from '../../services/auth.service';
import ChatService from '../../services/chat.service';
import { GroupChatMessages } from '../../types/chat.type';

const socket = io('http://localhost:3232');

interface Props {
  handleClose: any;
  projectId: string;
  userName: string;
}

const ProjectChat = ({ handleClose, projectId, userName }: Props) => {
  const [show, setShow] = useState(true);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<GroupChatMessages[]>([]);

  const userData = AuthService.getCurrentUser();

  const close = () => {
    handleClose();
    setShow(false);
  };

  const getChat = async () => {
    console.log(projectId);
    await ChatService.getMessages(projectId)
      .then((response) => {
        setMessages(response.data[0].messages as GroupChatMessages[]);
        console.log(response.data[0].messages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    socket.emit('join_room', { id: projectId, user_id: userData.user._id });
    getChat();
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const sendMessage = async () => {
    if (currentMessage.length > 0) {
      const messageData = {
        senderId: userData.user._id,
        username: userName,
        content: currentMessage,
        _id: projectId,
        timestamp: new Date(Date.now()),
      };

      await socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);

      ChatService.sendMessage(
        projectId,
        currentMessage,
        userName,
        userData.user._id
      );
      setCurrentMessage('');
    }
  };

  const handleReceiveMessage = useCallback(
    (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    },
    [setMessages]
  );

  useEffect(() => {
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.emit('disconnect_room', {
        id: projectId,
        user_id: userData.user._id,
      });
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  return (
    <>
      <Modal
        show={show}
        onHide={() => close()}
        /* className="w-90"
        dialogClassName="modal-90w" */
        data-cy="project-chat-modal"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="example-custom-modal-styling-title"
            data-cy="project-chat-modal-title"
          >
            Project chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body data-cy="project-chat-modal-body">
          <div className="chat-window">
            <div className="chat-body">
              <ScrollToBottom
                className="message-container"
                data-cy="project-chat-message-container"
              >
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
                          key={messageContent.timestamp.toString()}
                          className="message"
                          id={
                            userData.user._id === messageContent.senderId
                              ? 'you'
                              : 'other'
                          }
                          data-cy="message-div"
                        >
                          <div>
                            <div className="message-content" data-cy="message">
                              <p>{messageContent.content}</p>
                            </div>
                            <div className="message-meta">
                              <p id="author" className="mr-1">
                                {messageContent.username}
                              </p>
                              <p id="time">
                                {month}/{day}/{year} {hour24}:{minute24}
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
                data-cy="message-input"
                className="form-control justify-content-start"
                value={currentMessage}
                placeholder="Your message.."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === 'Enter' && sendMessage();
                }}
              />
              <button onClick={sendMessage} data-cy="send-message-button">
                &#9658;
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectChat;
