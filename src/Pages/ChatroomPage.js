import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";

const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const chatroomname = match.params.chtrmnm;
  // const autoFocusRef = useRef();
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }

    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);

        // autoFocusRef.current.scrollIntoView();
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //When component unmounts
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };

    //eslint-disable-next-line
  }, []);

  return (
    <div className="chatroompage">
      <div className="chatroomSection">
        <div className="cardHeader1">{chatroomname}</div>

        <div className="chatroomContent">
          {messages.map((message, i) => (
            <div
              key={i}
              className={
                userId === message.userId ? "ownMessageWrapper" : "message"
              }
            >
              <span
                className={
                  userId === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>
              {/* {message.message} */}
              <span>{message.message}</span>
            </div>
          ))}
          {/* <div className="autofocusdiv" ref={autoFocusRef}></div> */}
        </div>
        <div className="chatroomActions">
          <input
            type="text"
            name="message"
            placeholder="Say something!"
            ref={messageRef}
          />
          <button className="join" onClick={sendMessage}>
            Send
            <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
