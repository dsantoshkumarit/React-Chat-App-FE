import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import io from "socket.io-client";
import makeToast from "./Toaster";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("https://node-chat-app-be.herokuapp.com", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={IndexPage}></Route>
        <Route
          exact
          path="/login"
          render={() => <LoginPage setupSocket={setupSocket} />}
        ></Route>
        <Route exact path="/register" component={RegisterPage}></Route>
        <Route
          exact
          path="/dashboard"
          render={() => <DashboardPage socket={socket} />}
        />
        <Route
          exact
          path="/chatroom/:id/:chtrmnm"
          render={() => <ChatroomPage socket={socket} />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
