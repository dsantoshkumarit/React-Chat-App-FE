import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";

export default function DashboardPage(props) {
  const [chatrooms, setChatrooms] = useState([]);
  const chatroomNameRef = React.createRef();

  const createChatRoom = () => {
    let chatroomname = chatroomNameRef.current.value;
    axios
      .post(
        "https://node-chat-app-be.herokuapp.com/chatroom",
        {
          name: chatroomname,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        makeToast("success", response.data.message);
        getChatrooms();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  const getChatrooms = () => {
    axios
      .get("http://localhost:3000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    getChatrooms();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="Avengers Den"
            ref={chatroomNameRef}
          />
        </div>
        <button onClick={createChatRoom}>Create Chatroom</button>
        <div className="chatrooms">
          {chatrooms.map((chatroom) => (
            <div key={chatroom._id} className="chatroom">
              <div className="chatroomname">{chatroom.name}</div>
              <Link to={"/chatroom/" + chatroom._id + "/" + chatroom.name}>
                <div className="join">Join</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
