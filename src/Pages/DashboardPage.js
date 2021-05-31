import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DashboardPage(props) {
  const [chatrooms, setChatrooms] = useState([]);

  const getChatrooms = () => {
    axios
      .get("https://node-chat-app-be.herokuapp.com/chatroom", {
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
          />
        </div>
        <button>Create Chatroom</button>
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
